package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.Instant
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "race")
data class RaceEntity(
    @Column(name = "race_date", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    var raceDate: LocalDateTime,
    @OneToMany(mappedBy = "race", fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST], orphanRemoval = true)
    val runners: MutableList<RaceRunnerEntity> = mutableListOf(),
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    @Column(name = "course_condition")
    var courseCondition: String? = null

    @Column(name = "weather_symbol")
    var weatherSymbol: String? = null

    @Column(name = "weather_temperature")
    var weatherTemperature: Double? = null

    @Column(name = "weather_wind_speed")
    var weatherWindSpeed: Double? = null

    @Column(name = "weather_precipitation")
    var weatherPrecipitation: Double? = null

    @Column(name = "weather_updated_at")
    var weatherUpdatedAt: Instant? = null

    @Column(name = "weather_manually_edited")
    var weatherManuallyEdited: Boolean = false

    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST])
    @JoinTable(
        name = "race_photo",
        joinColumns = [JoinColumn(name = "race_uuid")],
        inverseJoinColumns = [JoinColumn(name = "file_uuid")],
    )
    val photos: MutableSet<FileEntity> = mutableSetOf()

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

    fun toDto(): RaceDTO =
        RaceDTO(
            uuid = uuid,
            raceDate = raceDate,
            weather = weatherToDto(),
            courseCondition = courseCondition,
            weatherManuallyEdited = weatherManuallyEdited,
            runnerCount = runners.size,
            photos = photos.mapNotNull { it.toDto() },
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
