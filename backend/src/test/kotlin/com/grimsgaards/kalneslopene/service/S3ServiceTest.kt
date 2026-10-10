package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.s3.FileEntity
import com.grimsgaards.kalneslopene.s3.FileRepository
import com.grimsgaards.kalneslopene.s3.S3Service
import io.minio.MinioClient
import io.minio.StatObjectArgs
import io.minio.errors.ErrorResponseException
import io.minio.messages.ErrorResponse
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
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
    inner class ConfirmUploadedRacePhotos {
        private val racePhotoPrefix = "http://localhost:9000/bucket/race-photos/"

        @Test
        fun `confirms pending race photos that exist in the bucket`() {
            val file = FileEntity(url = "${racePhotoPrefix}race/pic.webp")
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoPrefix))
                .thenReturn(listOf(file))

            service().confirmUploadedRacePhotos()

            assertThat(file.uploadConfirmedAt).isNotNull()
            verify(fileRepository).saveAll(listOf(file))
        }

        @Test
        fun `leaves pending race photos missing from the bucket unconfirmed`() {
            val file = FileEntity(url = "${racePhotoPrefix}race/pic.webp")
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoPrefix))
                .thenReturn(listOf(file))
            val missing = errorResponse("NoSuchKey")
            whenever(minioClient.statObject(any<StatObjectArgs>())).thenThrow(missing)

            service().confirmUploadedRacePhotos()

            assertThat(file.uploadConfirmedAt).isNull()
            verify(fileRepository, never()).saveAll(any<List<FileEntity>>())
        }

        @Test
        fun `propagates bucket errors other than a missing object`() {
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoPrefix))
                .thenReturn(listOf(FileEntity(url = "${racePhotoPrefix}race/pic.webp")))
            val accessDenied = errorResponse("AccessDenied")
            whenever(minioClient.statObject(any<StatObjectArgs>())).thenThrow(accessDenied)

            assertThatThrownBy { service().confirmUploadedRacePhotos() }
                .isInstanceOf(ErrorResponseException::class.java)
        }

        @Test
        fun `does not query the bucket when nothing is pending`() {
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith(racePhotoPrefix))
                .thenReturn(emptyList())

            service().confirmUploadedRacePhotos()

            verify(minioClient, never()).statObject(any<StatObjectArgs>())
        }
    }

    @Nested
    inner class DeleteExpiredUnconfirmedUploads {
        @Test
        fun `confirms uploaded race photos before deleting expired uploads`() {
            val file = FileEntity(url = "http://localhost:9000/bucket/race-photos/race/pic.webp")
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndUrlStartingWith("http://localhost:9000/bucket/race-photos/"))
                .thenReturn(listOf(file))
            whenever(fileRepository.findAllByUploadConfirmedAtIsNullAndCreatedAtBefore(anyValue()))
                .thenReturn(emptyList())

            service().deleteExpiredUnconfirmedUploads()

            assertThat(file.uploadConfirmedAt).isNotNull()
            verify(fileRepository, never()).deleteAll(any<List<FileEntity>>())
        }
    }

    private fun errorResponse(code: String): ErrorResponseException {
        val exception = mock(ErrorResponseException::class.java)
        whenever(exception.errorResponse()).thenReturn(
            ErrorResponse(code, null, null, null, null, null, null),
        )
        return exception
    }

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
