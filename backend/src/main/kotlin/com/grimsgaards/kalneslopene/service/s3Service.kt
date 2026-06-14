package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.repository.FileRepository
import io.minio.GetPresignedObjectUrlArgs
import io.minio.Http
import io.minio.MinioClient
import io.minio.RemoveObjectsArgs
import io.minio.messages.DeleteRequest
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.UUID
import java.util.concurrent.TimeUnit

@Service
class S3Service(
    @Value("\${minio.endpoint}")
    private val minioEndpoint: String,
    @Value("\${minio.access-key}")
    private val minioAccessKey: String,
    @Value("\${minio.secret-key}")
    private val minioSecretKey: String,
    @Value("\${minio.bucket-name}")
    private val minioBucketName: String,
    private val fileRepository: FileRepository,
) {
    private val logger = logger()
    private val baseUrl = minioEndpoint.let { if (it.startsWith("http")) it else "https://$it" }

    private val minioClient: MinioClient = MinioClient.builder()
        .endpoint(minioEndpoint)
        .credentials(minioAccessKey, minioSecretKey)
        .build()

    /** Public base URL of the bucket, e.g. `https://<endpoint>/<bucket>`, for composing static image URLs. */
    fun getPublicBaseUrl(): String = "$baseUrl/$minioBucketName"

    fun getPresignedUrl(fileName: String, expiryHours: Int = 1): String =
        minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Http.Method.PUT)
                .bucket(minioBucketName)
                .`object`(fileName)
                .expiry(expiryHours, TimeUnit.HOURS)
                .build()
        )

    @Transactional
    fun confirmUpload(fileUuid: UUID): FileEntity {
        val fileEntity = fileRepository.findById(fileUuid).orElseThrow { NoSuchElementException("File with id $fileUuid not found") }
        fileEntity.uploadConfirmedAt = OffsetDateTime.now()
        return fileRepository.save(fileEntity)
    }

    @Transactional
    fun deleteFilesByUuid(fileUuids: List<UUID>) {
        val fileEntities = fileRepository.findAllById(fileUuids)
        if (fileEntities.isEmpty()) return
        deleteFiles(fileEntities)
    }

    private fun deleteFiles(fileEntities: List<FileEntity>) {
        val objectsToDelete = fileEntities.map { DeleteRequest.Object(it.url.substringAfter("$baseUrl/$minioBucketName/")) }
        minioClient.removeObjects(
            RemoveObjectsArgs.builder()
                .bucket(minioBucketName)
                .objects(objectsToDelete)
                .build()
        ).forEach { it.get() }
        fileRepository.deleteAll(fileEntities)
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    fun deleteExpiredUnconfirmedUploads() {
        logger.info("Running scheduled task to delete expired unconfirmed uploads")
        val expiredFiles = fileRepository.findAllByUploadConfirmedAtIsNullAndCreatedAtBefore(OffsetDateTime.now().minusHours(1))
        logger.info("Found ${expiredFiles.size} expired unconfirmed uploads to delete")
        if (expiredFiles.isEmpty()) return
        deleteFiles(expiredFiles)
        logger.info("Deleted ${expiredFiles.size} expired unconfirmed uploads")
    }

    fun createFileEntities(fileNames: List<String>): List<FileEntity> {
        return fileNames.map {
            FileEntity(url = "$baseUrl/$minioBucketName/$it")
        }
    }
    fun createFileEntity(fileName: String): FileEntity {
        return createFileEntities(listOf(fileName)).first()
    }

    fun createAndSaveFileEntity(fileName: String): FileEntity {
        return fileRepository.save(createFileEntity(fileName))
    }
}
