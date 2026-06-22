package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.*
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
import java.time.OffsetDateTime
import java.util.*
import java.util.concurrent.atomic.AtomicReference

@MockitoSettings(strictness = Strictness.LENIENT)
class NewsfeedServiceTest {
    @Mock
    lateinit var newsfeedRepository: NewsfeedRepository

    @Mock
    lateinit var s3Service: S3Service

    private lateinit var service: NewsfeedService

    @BeforeEach
    fun setUp() {
        // The service resolves settings in a constructor-time field initializer; returning an
        // existing settings row keeps construction from trying to persist a default.

        whenever(newsfeedRepository.save(any())).thenAnswer { it.getArgument(0) }

        service = NewsfeedService(newsfeedRepository, s3Service)
    }

    @Nested
    inner class CreateNewsfeed {
        @Test
        fun `confirms the referenced header image upload`() {
            val fileUuid = UUID.randomUUID()
            val confirmed = confirmedFile()
            whenever(s3Service.confirmUpload(fileUuid)).thenReturn(confirmed)

            val result = service.createNewsfeed(input(headerImageUuid = fileUuid))

            verify(s3Service).confirmUpload(fileUuid)
            assertThat(result.headerImage).isNotNull
            assertThat(result.headerImage!!.uuid).isEqualTo(confirmed.uuid)
        }

        @Test
        fun `without a header image never confirms an upload`() {
            val result = service.createNewsfeed(input(headerImageUuid = null))

            verifyNoInteractions(s3Service)
            assertThat(result.headerImage).isNull()
        }
    }

    @Nested
    inner class UpdateNewsfeed {
        @Test
        fun `leaves an unchanged header image untouched`() {
            val existing = newsfeed(headerImage = confirmedFile())
            val sameUuid = existing.headerImage!!.uuid
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))

            service.updateNewsfeed(existing.uuid, input(headerImageUuid = sameUuid))

            verifyNoInteractions(s3Service)
        }

        @Test
        fun `adding a header image confirms but deletes nothing`() {
            val existing = newsfeed(headerImage = null)
            val newUuid = UUID.randomUUID()
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))
            whenever(s3Service.confirmUpload(newUuid)).thenReturn(confirmedFile())

            val result = service.updateNewsfeed(existing.uuid, input(headerImageUuid = newUuid))

            verify(s3Service).confirmUpload(newUuid)
            verifyNoMoreInteractions(s3Service)
            assertThat(result.headerImage).isNotNull
        }

        @Test
        fun `replacing a header image confirms the new file then deletes the old one`() {
            val existing = newsfeed(headerImage = confirmedFile())
            val oldUuid = existing.headerImage!!.uuid
            val newUuid = UUID.randomUUID()
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))
            whenever(s3Service.confirmUpload(newUuid)).thenReturn(confirmedFile())

            service.updateNewsfeed(existing.uuid, input(headerImageUuid = newUuid))

            verify(s3Service).confirmUpload(newUuid)
            verify(s3Service).deleteFilesByUuid(listOf(oldUuid))

            // The old file must only be deleted after the newsfeed no longer references it.
            val order = inOrder(newsfeedRepository, s3Service)
            order.verify(newsfeedRepository).save(any())
            order.verify(s3Service).deleteFilesByUuid(listOf(oldUuid))
        }

        @Test
        fun `removing a header image clears it and deletes the old file`() {
            val existing = newsfeed(headerImage = confirmedFile())
            val oldUuid = existing.headerImage!!.uuid
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))

            val result = service.updateNewsfeed(existing.uuid, input(headerImageUuid = null))

            assertThat(result.headerImage).isNull()
            verify(s3Service).deleteFilesByUuid(listOf(oldUuid))
            verifyNoMoreInteractions(s3Service)

            val order = inOrder(newsfeedRepository, s3Service)
            order.verify(newsfeedRepository).save(any())
            order.verify(s3Service).deleteFilesByUuid(listOf(oldUuid))
        }

        @Test
        fun `throws when the newsfeed does not exist`() {
            val missing = UUID.randomUUID()
            whenever(newsfeedRepository.findById(missing)).thenReturn(Optional.empty())

            assertThatThrownBy { service.updateNewsfeed(missing, input()) }
                .isInstanceOf(NoSuchElementException::class.java)

            verifyNoInteractions(s3Service)
        }
    }

    @Nested
    inner class DeleteNewsfeed {
        @Test
        fun `deletes the row then its header image file`() {
            val existing = newsfeed(headerImage = confirmedFile())
            val headerUuid = existing.headerImage!!.uuid
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))

            service.deleteNewsfeed(existing.uuid)

            val order = inOrder(newsfeedRepository, s3Service)
            order.verify(newsfeedRepository).deleteById(existing.uuid)
            order.verify(s3Service).deleteFilesByUuid(listOf(headerUuid))
        }

        @Test
        fun `without a header image does not touch s3`() {
            val existing = newsfeed(headerImage = null)
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))

            service.deleteNewsfeed(existing.uuid)

            verify(newsfeedRepository).deleteById(existing.uuid)
            verifyNoInteractions(s3Service)
        }

        @Test
        fun `of a missing row still issues the delete and skips s3`() {
            val missing = UUID.randomUUID()
            whenever(newsfeedRepository.findById(missing)).thenReturn(Optional.empty())

            service.deleteNewsfeed(missing)

            verify(newsfeedRepository).deleteById(missing)
            verifyNoInteractions(s3Service)
        }
    }

    @Nested
    inner class CreateHeaderImageUpload {
        @Test
        fun `saves an unconfirmed file under a namespaced key and presigns it`() {
            val saved = FileEntity(url = "https://minio.local/bucket/newsfeed-photos/x/pic.jpg")
            val savedKey = AtomicReference<String>()
            val presignedKey = AtomicReference<String>()
            whenever(s3Service.createAndSaveFileEntity(anyString())).thenAnswer {
                savedKey.set(it.getArgument(0))
                saved
            }
            whenever(s3Service.getPresignedUrl(anyString(), anyInt())).thenAnswer {
                presignedKey.set(it.getArgument(0))
                "https://minio.local/presigned"
            }

            val result = service.createHeaderImageUpload("pic.jpg")

            val key = savedKey.get()
            assertThat(key).startsWith("newsfeed-photos/")
            assertThat(key).endsWith("/pic.jpg")

            // The exact same key must be presigned, otherwise the client uploads to the wrong object.
            assertThat(presignedKey.get()).isEqualTo(key)

            assertThat(result.uploadUrl).isEqualTo("https://minio.local/presigned")
            assertThat(result.s3File.uuid).isEqualTo(saved.uuid)
            assertThat(result.s3File.url).isEqualTo(saved.url)
        }
    }

    private fun newsfeed(headerImage: FileEntity?) =
        NewsfeedEntity(
            tags = listOf("nyhet"),
            header = "Tittel",
            content = "Innhold",
            date = OffsetDateTime.parse("2026-06-14T10:00:00Z"),
            headerImage = headerImage,
        )

    private fun confirmedFile() =
        FileEntity(url = "https://minio.local/bucket/${UUID.randomUUID()}.jpg")
            .apply { uploadConfirmedAt = OffsetDateTime.now() }

    private fun input(headerImageUuid: UUID? = null) =
        NewsfeedInput(
            tags = listOf("nyhet"),
            header = "Tittel",
            content = "Innhold",
            date = OffsetDateTime.parse("2026-06-14T10:00:00Z"),
            headerImageUuid = headerImageUuid,
        )

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
