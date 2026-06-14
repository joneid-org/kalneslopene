package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.repository.FileRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mock
import org.mockito.Mockito
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

    private fun service(endpoint: String = "http://localhost:9000") =
        S3Service(
            minioEndpoint = endpoint,
            minioAccessKey = "access",
            minioSecretKey = "secret",
            minioBucketName = "bucket",
            fileRepository = fileRepository,
        )

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
