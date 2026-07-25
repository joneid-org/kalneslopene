package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.Instant
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "race")
class RaceEntity(
    @Column(name = "race_date", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    var raceDate: LocalDateTime,
    var isPublished: Boolean = false,
    @OneToMany(mappedBy = "race", fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST], orphanRemoval = true)
    val runners: MutableList<RaceRunnerEntity> = mutableListOf(),
) {
    @Id
    val uuid: UUID = UUID.randomUUID()
    var courseCondition: String? = null
    var weatherSymbol: String? = null
    var weatherTemperature: Double? = null
    var weatherWindSpeed: Double? = null
    var weatherPrecipitation: Double? = null
    var weatherUpdatedAt: Instant? = null
    var weatherManuallyEdited: Boolean = false

    @OneToMany(mappedBy = "race", fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
    val racePhotos: MutableList<RacePhotoEntity> = mutableListOf()

    fun applyWeatherOverride(weather: WeatherDto?) {
        val unchanged =
            weather != null &&
                weather.symbol == weatherSymbol &&
                weather.temperature == weatherTemperature &&
                weather.windSpeed == weatherWindSpeed &&
                weather.precipitation == weatherPrecipitation
        if (weather == null || unchanged) return

        weatherSymbol = weather.symbol
        weatherTemperature = weather.temperature
        weatherWindSpeed = weather.windSpeed
        weatherPrecipitation = weather.precipitation
        weatherManuallyEdited = true
    }

    fun allowWeatherAutoUpdates(): Boolean = !weatherManuallyEdited

    fun toDto(): RaceDTO =
        RaceDTO(
            uuid = uuid,
            raceDate = raceDate,
            weather = weatherToDto(),
            courseCondition = courseCondition,
            weatherManuallyEdited = weatherManuallyEdited,
            runnerCount = runners.size,
            isPublished = isPublished,
            photos = racePhotos.sortedBy { it.orderIndex }.mapNotNull { it.file.toDto() },
        )

    private fun weatherToDto(): WeatherDto? {
        val symbol = weatherSymbol
        val temperature = weatherTemperature
        val windSpeed = weatherWindSpeed
        if (symbol == null || temperature == null || windSpeed == null) return null
        return WeatherDto(
            symbol = symbol,
            temperature = temperature,
            windSpeed = windSpeed,
            precipitation = weatherPrecipitation ?: NO_PRECIPITATION,
        )
    }

    companion object {
        private const val NO_PRECIPITATION = 0.0
    }
}
