package com.grimsgaards.kalneslopene.model.entities

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.time.OffsetDateTime

class RaceEntityToDtoTest {
    private fun race() = RaceEntity(raceDate = LocalDateTime.parse("2026-06-14T18:00:00"))

    private fun confirmedFile(url: String) = FileEntity(url = url).apply { uploadConfirmedAt = OffsetDateTime.now() }

    @Test
    fun `maps stored structured weather to dto`() {
        val race =
            race().apply {
                weatherSymbol = "clearsky_day"
                weatherTemperature = 15.0
                weatherWindSpeed = 3.5
                weatherPrecipitation = 0.0
            }

        val weather = race.toDto().weather

        assertThat(weather).isNotNull
        assertThat(weather?.symbol).isEqualTo("clearsky_day")
        assertThat(weather?.temperature).isEqualTo(15.0)
        assertThat(weather?.windSpeed).isEqualTo(3.5)
    }

    @Test
    fun `weather is null when no forecast is stored`() {
        assertThat(race().toDto().weather).isNull()
    }

    @Test
    fun `exposes only confirmed photos and never nulls`() {
        val race = race()
        race.photos.add(confirmedFile("https://minio.local/bucket/confirmed.jpg"))
        race.photos.add(FileEntity(url = "https://minio.local/bucket/pending.jpg"))

        val dto = race.toDto()

        assertThat(dto.photos).hasSize(1)
        assertThat(dto.photos).doesNotContainNull()
        assertThat(dto.photos.map { it.url }).containsExactly("https://minio.local/bucket/confirmed.jpg")
    }

    @Test
    fun `returns no photos when none are confirmed`() {
        val race = race()
        race.photos.add(FileEntity(url = "https://minio.local/bucket/pending-a.jpg"))
        race.photos.add(FileEntity(url = "https://minio.local/bucket/pending-b.jpg"))

        val dto = race.toDto()

        assertThat(dto.photos).isEmpty()
    }
}
