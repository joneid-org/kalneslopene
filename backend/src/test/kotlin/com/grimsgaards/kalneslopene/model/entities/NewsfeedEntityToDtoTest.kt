package com.grimsgaards.kalneslopene.model.entities

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime

class NewsfeedEntityToDtoTest {
    private fun newsfeed(headerImage: FileEntity? = null) =
        NewsfeedEntity(
            tags = listOf("nyhet", "resultat"),
            header = "Tittel",
            content = "Innhold",
            date = OffsetDateTime.parse("2026-06-14T10:00:00Z"),
            headerImage = headerImage,
            images = listOf("img-a", "img-b"),
        )

    @Test
    fun `maps scalar fields onto the dto`() {
        val entity = newsfeed()

        val dto = entity.toDto()

        assertThat(dto.uuid).isEqualTo(entity.uuid)
        assertThat(dto.tags).containsExactly("nyhet", "resultat")
        assertThat(dto.header).isEqualTo("Tittel")
        assertThat(dto.content).isEqualTo("Innhold")
        assertThat(dto.date).isEqualTo(OffsetDateTime.parse("2026-06-14T10:00:00Z"))
        assertThat(dto.images).containsExactly("img-a", "img-b")
    }

    @Nested
    inner class HeaderImage {
        @Test
        fun `is null when no file is attached`() {
            val dto = newsfeed(headerImage = null).toDto()

            assertThat(dto.headerImage).isNull()
        }

        @Test
        fun `is exposed when the attached file is confirmed`() {
            val file =
                FileEntity(url = "https://minio.local/bucket/header.jpg")
                    .apply { uploadConfirmedAt = OffsetDateTime.now() }

            val dto = newsfeed(headerImage = file).toDto()

            assertThat(dto.headerImage).isNotNull
            assertThat(dto.headerImage!!.uuid).isEqualTo(file.uuid)
            assertThat(dto.headerImage.url).isEqualTo("https://minio.local/bucket/header.jpg")
        }

        @Test
        fun `stays null when the attached file is unconfirmed`() {
            val unconfirmed = FileEntity(url = "https://minio.local/bucket/header.jpg")

            val dto = newsfeed(headerImage = unconfirmed).toDto()

            assertThat(dto.headerImage).isNull()
        }
    }
}
