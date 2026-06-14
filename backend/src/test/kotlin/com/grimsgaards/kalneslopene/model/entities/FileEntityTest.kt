package com.grimsgaards.kalneslopene.model.entities

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime

class FileEntityTest {
    private val url = "https://minio.local/bucket/newsfeed-photos/abc/pic.jpg"

    @Nested
    inner class Mapping {
        @Test
        fun `toDto returns null when upload is not confirmed`() {
            val file = FileEntity(url = url)

            assertThat(file.toDto()).isNull()
        }

        @Test
        fun `toDto returns a dto once the upload is confirmed`() {
            val file = FileEntity(url = url)
            file.uploadConfirmedAt = OffsetDateTime.now()

            val dto = file.toDto()

            assertThat(dto).isNotNull
            assertThat(dto!!.uuid).isEqualTo(file.uuid)
            assertThat(dto.url).isEqualTo(url)
        }

        @Test
        fun `toDtoDangerously returns a dto even when the upload is unconfirmed`() {
            val file = FileEntity(url = url)

            val dto = file.toDtoDangerously()

            assertThat(dto.uuid).isEqualTo(file.uuid)
            assertThat(dto.url).isEqualTo(url)
        }
    }

    @Nested
    inner class UploadConfirmation {
        @Test
        fun `can be set once`() {
            val file = FileEntity(url = url)
            val confirmedAt = OffsetDateTime.now()

            file.uploadConfirmedAt = confirmedAt

            assertThat(file.uploadConfirmedAt).isEqualTo(confirmedAt)
        }

        @Test
        fun `cannot be confirmed a second time`() {
            val file = FileEntity(url = url)
            file.uploadConfirmedAt = OffsetDateTime.now()

            assertThatThrownBy { file.uploadConfirmedAt = OffsetDateTime.now() }
                .isInstanceOf(IllegalArgumentException::class.java)
                .hasMessageContaining("already been confirmed")
        }
    }
}
