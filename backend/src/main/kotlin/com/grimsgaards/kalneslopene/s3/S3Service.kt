package com.grimsgaards.kalneslopene.s3

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.race.RACE_INFO_CACHE
import io.minio.GetPresignedObjectUrlArgs
import io.minio.Http
import io.minio.MinioClient
import io.minio.RemoveObjectsArgs
import io.minio.StatObjectArgs
import io.minio.errors.ErrorResponseException
import io.minio.messages.DeleteRequest
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.cache.annotation.CacheEvict
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.UUID
import java.util.concurrent.TimeUnit

private val imgSrcRegex = Regex("""<img[^>]+src="([^"]*)"""")

// Uploaded photos live at a unique, never-overwritten path, so they can be cached forever.
const val IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable"

@Service
@Suppress("TooManyFunctions")
class S3Service(
    @Value("\${minio.endpoint}")
    minioEndpoint: String,
    @Value("\${minio.bucket-name}")
    private val minioBucketName: String,
    private val minioClient: MinioClient,
    private val fileRepository: FileRepository,
) {
    private val logger = logger()
    private val baseUrl = minioEndpoint.let { if (it.startsWith("http")) it else "https://$it" }

    /** Public base URL of the bucket, e.g. `https://<endpoint>/<bucket>`, for composing static image URLs. */
    fun getPublicBaseUrl(): String = "$baseUrl/$minioBucketName"

    fun getPresignedUrl(
        fileName: String,
        expiryHours: Int = 1,
        immutable: Boolean = false,
    ): String =
        minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs
                .builder()
                .method(Http.Method.PUT)
                .bucket(minioBucketName)
                .`object`(fileName)
                .expiry(expiryHours, TimeUnit.HOURS)
                .apply {
                    // Signed into the PUT; the client must send the exact same header value (see uploadToS3).
                    if (immutable) extraHeaders(mapOf("Cache-Control" to IMMUTABLE_CACHE_CONTROL))
                }.build(),
        )

    fun getPresignedUrls(
        fileNames: List<String>,
        expiryHours: Int = 1,
    ): Map<String, String> = fileNames.associateWith { getPresignedUrl(it, expiryHours) }

    @Transactional
    fun confirmUpload(fileUuid: UUID): FileEntity {
        val fileEntity =
            fileRepository.findById(fileUuid).orElseThrow { NoSuchElementException("File with id $fileUuid not found") }
        fileEntity.uploadConfirmedAt = OffsetDateTime.now()
        return fileRepository.save(fileEntity)
    }

    @Transactional
    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun deleteFilesByUuid(fileUuids: List<UUID>) {
        val fileEntities = fileRepository.findAllById(fileUuids)
        if (fileEntities.isEmpty()) return
        deleteFiles(fileEntities)
    }

    /** Bucket image URLs (e.g. inline editor images) referenced from an HTML string. */
    fun extractBucketImageUrls(html: String): Set<String> {
        val prefix = "$baseUrl/$minioBucketName/"
        return imgSrcRegex
            .findAll(html)
            .map { it.groupValues[1] }
            .filter { it.startsWith(prefix) }
            .toSet()
    }

    @Transactional
    fun confirmUploadsByUrl(urls: Collection<String>) {
        if (urls.isEmpty()) return
        val unconfirmed = fileRepository.findAllByUrlIn(urls).filter { it.uploadConfirmedAt == null }
        if (unconfirmed.isEmpty()) return
        val now = OffsetDateTime.now()
        unconfirmed.forEach { it.uploadConfirmedAt = now }
        fileRepository.saveAll(unconfirmed)
    }

    @Transactional
    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun deleteFilesByUrl(urls: Collection<String>) {
        if (urls.isEmpty()) return
        val fileEntities = fileRepository.findAllByUrlIn(urls)
        if (fileEntities.isEmpty()) return
        deleteFiles(fileEntities)
    }

    private fun deleteFiles(fileEntities: List<FileEntity>) {
        val objectsToDelete = fileEntities.map { DeleteRequest.Object(it.objectKey()) }
        minioClient
            .removeObjects(
                RemoveObjectsArgs
                    .builder()
                    .bucket(minioBucketName)
                    .objects(objectsToDelete)
                    .build(),
            ).forEach { it.get() }
        fileRepository.deleteAll(fileEntities)
    }

    private fun FileEntity.objectKey() = url.substringAfter("$baseUrl/$minioBucketName/")

    private fun objectExists(file: FileEntity): Boolean =
        try {
            minioClient.statObject(
                StatObjectArgs
                    .builder()
                    .bucket(minioBucketName)
                    .`object`(file.objectKey())
                    .build(),
            )
            true
        } catch (e: ErrorResponseException) {
            if (e.errorResponse().code() == "NoSuchKey") false else throw e
        }

    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
    @Transactional
    fun confirmUploadedRacePhotos() {
        val pending =
            fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith("$baseUrl/$minioBucketName/race-photos/")
        val uploaded = pending.filter(::objectExists)
        if (uploaded.isEmpty()) return
        val now = OffsetDateTime.now()
        uploaded.forEach { it.uploadConfirmedAt = now }
        fileRepository.saveAll(uploaded)
        logger.info("Confirmed ${uploaded.size} uploaded race photos")
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun deleteExpiredUnconfirmedUploads() {
        confirmUploadedRacePhotos()
        logger.info("Running scheduled task to delete expired unconfirmed uploads")
        val expiredFiles =
            fileRepository.findAllByUploadConfirmedAtIsNullAndCreatedAtBefore(OffsetDateTime.now().minusHours(1))
        logger.info("Found ${expiredFiles.size} expired unconfirmed uploads to delete")
        if (expiredFiles.isEmpty()) return
        deleteFiles(expiredFiles)
        logger.info("Deleted ${expiredFiles.size} expired unconfirmed uploads")
    }

    fun createFileEntities(fileNames: List<String>): Map<String, FileEntity> {
        val fileMap =
            fileNames.associate {
                it to FileEntity(url = "$baseUrl/$minioBucketName/$it")
            }
        fileRepository.saveAll(fileMap.values)
        return fileMap
    }

    fun createFileEntity(fileName: String): FileEntity = createFileEntities(listOf(fileName)).values.first()

    fun createAndSaveFileEntity(fileName: String): FileEntity = fileRepository.save(createFileEntity(fileName))
}
