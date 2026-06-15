package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedSettingsEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedSettingsRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.ArgumentMatchers.anyInt
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.inOrder
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.Mockito.verifyNoInteractions
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
import java.time.OffsetDateTime
import java.util.Optional
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

@MockitoSettings(strictness = Strictness.LENIENT)
class NewsfeedServiceTest {
    @Mock
    lateinit var newsfeedRepository: NewsfeedRepository

    @Mock
    lateinit var newsfeedSettingsRepository: NewsfeedSettingsRepository

    @Mock
    lateinit var s3Service: S3Service

    private lateinit var service: NewsfeedService

    @BeforeEach
    fun setUp() {
        // The service resolves settings in a constructor-time field initializer; returning an
        // existing settings row keeps construction from trying to persist a default.
        whenever(newsfeedSettingsRepository.findAll())
            .thenReturn(listOf(NewsfeedSettingsEntity(id = 1, maxArticles = 10)))
        whenever(newsfeedRepository.save(any())).thenAnswer { it.getArgument(0) }

        service = NewsfeedService(newsfeedRepository, newsfeedSettingsRepository, s3Service)
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

            verify(s3Service, never()).confirmUpload(anyValue())
            assertThat(result.headerImage).isNull()
        }

        @Test
        fun `confirms the content images referenced in the body`() {
            val urls = setOf("https://minio.local/bucket/newsfeed-content/x/a.jpg")
            whenever(s3Service.extractBucketImageUrls("body")).thenReturn(urls)

            service.createNewsfeed(input(content = "body"))

            verify(s3Service).confirmUploadsByUrl(urls)
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

            verify(s3Service, never()).confirmUpload(anyValue())
            verify(s3Service, never()).deleteFilesByUuid(anyValue())
        }

        @Test
        fun `adding a header image confirms but deletes nothing`() {
            val existing = newsfeed(headerImage = null)
            val newUuid = UUID.randomUUID()
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))
            whenever(s3Service.confirmUpload(newUuid)).thenReturn(confirmedFile())

            val result = service.updateNewsfeed(existing.uuid, input(headerImageUuid = newUuid))

            verify(s3Service).confirmUpload(newUuid)
            verify(s3Service, never()).deleteFilesByUuid(anyValue())
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
            verify(s3Service, never()).confirmUpload(anyValue())

            val order = inOrder(newsfeedRepository, s3Service)
            order.verify(newsfeedRepository).save(any())
            order.verify(s3Service).deleteFilesByUuid(listOf(oldUuid))
        }

        @Test
        fun `confirms new content images and deletes the ones no longer referenced`() {
            val existing = newsfeed(headerImage = null, content = "old")
            val keep = "https://minio.local/bucket/newsfeed-content/x/keep.jpg"
            val drop = "https://minio.local/bucket/newsfeed-content/x/drop.jpg"
            val add = "https://minio.local/bucket/newsfeed-content/x/add.jpg"
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))
            whenever(s3Service.extractBucketImageUrls("old")).thenReturn(setOf(keep, drop))
            whenever(s3Service.extractBucketImageUrls("new")).thenReturn(setOf(keep, add))

            service.updateNewsfeed(existing.uuid, input(content = "new"))

            verify(s3Service).confirmUploadsByUrl(setOf(keep, add))
            verify(s3Service).deleteFilesByUrl(setOf(drop))
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
            verify(s3Service, never()).deleteFilesByUuid(anyValue())
        }

        @Test
        fun `of a missing row still issues the delete and skips s3`() {
            val missing = UUID.randomUUID()
            whenever(newsfeedRepository.findById(missing)).thenReturn(Optional.empty())

            service.deleteNewsfeed(missing)

            verify(newsfeedRepository).deleteById(missing)
            verify(s3Service, never()).deleteFilesByUuid(anyValue())
        }

        @Test
        fun `deletes the content image files referenced in the body`() {
            val existing = newsfeed(headerImage = null, content = "body")
            val urls = setOf("https://minio.local/bucket/newsfeed-content/x/a.jpg")
            whenever(newsfeedRepository.findById(existing.uuid)).thenReturn(Optional.of(existing))
            whenever(s3Service.extractBucketImageUrls("body")).thenReturn(urls)

            service.deleteNewsfeed(existing.uuid)

            verify(s3Service).deleteFilesByUrl(urls)
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

    @Nested
    inner class CreateContentImageUpload {
        @Test
        fun `saves an unconfirmed file under a namespaced key and presigns it`() {
            val saved = FileEntity(url = "https://minio.local/bucket/newsfeed-content/x/pic.jpg")
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

            val result = service.createContentImageUpload("pic.jpg")

            val key = savedKey.get()
            assertThat(key).startsWith("newsfeed-content/")
            assertThat(key).endsWith("/pic.jpg")

            // The exact same key must be presigned, otherwise the client uploads to the wrong object.
            assertThat(presignedKey.get()).isEqualTo(key)

            assertThat(result.uploadUrl).isEqualTo("https://minio.local/presigned")
            assertThat(result.s3File.uuid).isEqualTo(saved.uuid)
            assertThat(result.s3File.url).isEqualTo(saved.url)
        }
    }

    private fun newsfeed(
        headerImage: FileEntity?,
        content: String = "Innhold",
    ) = NewsfeedEntity(
        tags = listOf("nyhet"),
        header = "Tittel",
        content = content,
        date = OffsetDateTime.parse("2026-06-14T10:00:00Z"),
        headerImage = headerImage,
    )

    private fun confirmedFile() =
        FileEntity(url = "https://minio.local/bucket/${UUID.randomUUID()}.jpg")
            .apply { uploadConfirmedAt = OffsetDateTime.now() }

    private fun input(
        headerImageUuid: UUID? = null,
        content: String = "Innhold",
    ) = NewsfeedInput(
        tags = listOf("nyhet"),
        header = "Tittel",
        content = content,
        date = OffsetDateTime.parse("2026-06-14T10:00:00Z"),
        headerImageUuid = headerImageUuid,
    )

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)

    // Mockito's `any()` returns null, which trips Kotlin's non-null parameter checks; this registers
    // the matcher and hands back an erased null that flows safely into non-null Kotlin parameters.
    @Suppress("UNCHECKED_CAST")
    private fun <T> anyValue(): T {
        Mockito.any<T>()
        return null as T
    }
}
