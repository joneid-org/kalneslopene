package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.context.annotation.Profile
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import kotlin.random.Random

/** Stands in for the real yr.no integration during local development, so it doesn't depend on network access. */
@Service
@Profile("local")
class WeatherServiceMock(
    private val raceRepository: RaceRepository,
) : WeatherService {
    private val logger = logger()

    @Scheduled(fixedRate = REFRESH_INTERVAL_MS, initialDelay = INITIAL_DELAY_MS)
    @Transactional
    override fun refreshUpcomingRaceWeather() {
        val now = LocalDateTime.now(OSLO_ZONE)
        val nextRace = raceRepository.findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(now)
        if (nextRace == null || !nextRace.allowWeatherAutoUpdates()) return

        val weather = randomWeather()
        nextRace.weatherSymbol = weather.symbol
        nextRace.weatherTemperature = weather.temperature
        nextRace.weatherWindSpeed = weather.windSpeed
        nextRace.weatherPrecipitation = weather.precipitation
        nextRace.weatherUpdatedAt = Instant.now()
        raceRepository.save(nextRace)
        logger.info("Applied mock weather for race ${nextRace.uuid} at ${nextRace.raceDate}")
    }

    companion object {
        private const val REFRESH_INTERVAL_MS = 5L * 60L * 1000L
        private const val INITIAL_DELAY_MS = 10L * 1000L
        private val OSLO_ZONE: ZoneId = ZoneId.of("Europe/Oslo")

        private const val MIN_TEMP = -15
        private const val MAX_TEMP = 35
        private const val MAX_WIND_DECI = 90
        private const val WIND_DECI = 10.0
        private const val MAX_PRECIP_DECI = 40
        private const val PRECIP_DECI = 10.0
        private const val PRECIP_CHANCE = 0.4
        private const val NO_PRECIP = 0.0
        private val MOCK_SYMBOLS =
            listOf("clearsky_day", "fair_day", "partlycloudy_day", "cloudy", "rainshowers_day", "rain", "lightrain", "snow", "fog")

        /** Shared with [com.grimsgaards.kalneslopene.mockdata.MockDataGenerator] so random weather isn't generated in two places. */
        fun randomWeather(random: Random = Random.Default): WeatherDto =
            WeatherDto(
                symbol = MOCK_SYMBOLS.random(random),
                temperature = random.nextInt(MIN_TEMP, MAX_TEMP).toDouble(),
                windSpeed = random.nextInt(MAX_WIND_DECI).toDouble() / WIND_DECI,
                precipitation =
                    if (random.nextDouble() < PRECIP_CHANCE) random.nextInt(MAX_PRECIP_DECI).toDouble() / PRECIP_DECI else NO_PRECIP,
            )
    }
}
