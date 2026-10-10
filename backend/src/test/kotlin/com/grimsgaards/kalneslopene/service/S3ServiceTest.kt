package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.s3.FileEntity
import com.grimsgaards.kalneslopene.s3.FileRepository
import com.grimsgaards.kalneslopene.s3.S3Service
import io.minio.ListObjectsArgs
import io.minio.MinioClient
import io.minio.Result
import io.minio.messages.Item
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.never
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
import java.time.OffsetDateTime
import java.util.UUID

@MockitoSettings(strictness = Strictness.LENIENT)
class S3ServiceTest {
    @Mock
    lateinit var fileRepository: FileRepository

    @Mock
    lateinit var minioClient: MinioClient

    @Nested
    inner class CreateFileEntity {
        @Test
        fun `builds an unconfirmed entity with a baseUrl bucket key url`() {
            val entity = service().createFileEntity("newsfeed-photos/abc/pic.jpg")

            assertThat(entity.url).isEqualTo("http://localhost:9000/bucket/newsfeed-photos/abc/pic.jpg")
            assertThat(entity.uploadConfirmedAt).isNull()
        }

        @Test
        fun `endpoint without a scheme is treated as https`() {
            val entity = service(endpoint = "minio.example.com").createFileEntity("pic.jpg")

            assertThat(entity.url).isEqualTo("https://minio.example.com/bucket/pic.jpg")
        }
    }

    @Nested
    inner class CreateAndSaveFileEntity {
        @Test
        fun `persists the built entity and returns it`() {
            whenever(fileRepository.save(any())).thenAnswer { it.getArgument(0) }

            val entity = service().createAndSaveFileEntity("pic.jpg")

            verify(fileRepository).save(entity)
            assertThat(entity.url).isEqualTo("http://localhost:9000/bucket/pic.jpg")
            assertThat(entity.uploadConfirmedAt).isNull()
        }
    }

    @Nested
    inner class DeleteFilesByUuid {
        @Test
        fun `returns early without deleting when nothing is found`() {
            whenever(fileRepository.findAllById(any<List<UUID>>())).thenReturn(emptyList())

            service().deleteFilesByUuid(listOf(UUID.randomUUID()))

            verify(fileRepository, never()).deleteAll(any<List<FileEntity>>())
        }
    }

    @Nested
    inner class ConfirmUploadedFiles {
        private val prefix = "race-photos/race/"

        @Test
        fun `confirms the files listed under the prefix`() {
            val file = FileEntity(url = "http://localhost:9000/bucket/${prefix}pic.webp")
            whenever(minioClient.listObjects(any<ListObjectsArgs>())).thenReturn(bucketListing("${prefix}pic.webp"))

            val confirmed = service().confirmUploadedFiles(listOf(file), prefix)

            assertThat(confirmed).isEqualTo(1)
            assertThat(file.uploadConfirmedAt).isNotNull()
            verify(fileRepository).saveAll(listOf(file))
        }

        @Test
        fun `leaves files missing from the bucket unconfirmed`() {
            val file = FileEntity(url = "http://localhost:9000/bucket/${prefix}pic.webp")
            whenever(minioClient.listObjects(any<ListObjectsArgs>())).thenReturn(bucketListing("${prefix}other.webp"))

            service().confirmUploadedFiles(listOf(file), prefix)

            assertThat(file.uploadConfirmedAt).isNull()
            verify(fileRepository, never()).saveAll(any<List<FileEntity>>())
        }

        @Test
        fun `does not query the bucket when every file is already confirmed`() {
            val file = FileEntity(url = "http://localhost:9000/bucket/${prefix}pic.webp")
            file.uploadConfirmedAt = OffsetDateTime.now()

            service().confirmUploadedFiles(listOf(file), prefix)

            verify(minioClient, never()).listObjects(any<ListObjectsArgs>())
        }
    }

    @Nested
    inner class ConfirmUploadedRacePhotos {
        private val racePhotoUrlPrefix = "http://localhost:9000/bucket/race-photos/"

        @Test
        fun `lists the bucket once per race`() {
            val files =
                listOf(
                    FileEntity(url = "${racePhotoUrlPrefix}a/1.webp"),
                    FileEntity(url = "${racePhotoUrlPrefix}a/2.webp"),
                    FileEntity(url = "${racePhotoUrlPrefix}b/1.webp"),
                )
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoUrlPrefix))
                .thenReturn(files)
            whenever(minioClient.listObjects(any<ListObjectsArgs>()))
                .thenReturn(bucketListing("race-photos/a/1.webp", "race-photos/a/2.webp", "race-photos/b/1.webp"))

            service().confirmUploadedRacePhotos()

            verify(minioClient, times(2)).listObjects(any<ListObjectsArgs>())
            assertThat(files).allSatisfy { assertThat(it.uploadConfirmedAt).isNotNull() }
        }

        @Test
        fun `does not query the bucket when nothing is pending`() {
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoUrlPrefix))
                .thenReturn(emptyList())

            service().confirmUploadedRacePhotos()

            verify(minioClient, never()).listObjects(any<ListObjectsArgs>())
        }
    }

    @Nested
    inner class DeleteExpiredUnconfirmedUploads {
        @Test
        fun `confirms uploaded race photos before deleting expired uploads`() {
            val file = FileEntity(url = "http://localhost:9000/bucket/race-photos/race/pic.webp")
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith("http://localhost:9000/bucket/race-photos/"))
                .thenReturn(listOf(file))
            whenever(minioClient.listObjects(any<ListObjectsArgs>())).thenReturn(bucketListing("race-photos/race/pic.webp"))
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndCreatedAtBefore(anyValue()))
                .thenReturn(emptyList())

            service().deleteExpiredUnconfirmedUploads()

            assertThat(file.uploadConfirmedAt).isNotNull()
            verify(fileRepository, never()).deleteAll(any<List<FileEntity>>())
        }
    }

    private fun bucketListing(vararg keys: String): Iterable<Result<Item>> = keys.map { Result<Item>(object : Item(it) {}) }

    private fun service(endpoint: String = "http://localhost:9000") =
        S3Service(
            minioEndpoint = endpoint,
            minioBucketName = "bucket",
            minioClient = minioClient,
            fileRepository = fileRepository,
        )

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)

    @Suppress("UNCHECKED_CAST")
    private fun <T> anyValue(): T {
        Mockito.any<T>()
        return null as T
    }
}
