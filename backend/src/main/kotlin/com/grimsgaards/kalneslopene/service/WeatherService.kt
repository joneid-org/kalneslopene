package com.grimsgaards.kalneslopene.service

import com.fasterxml.jackson.annotation.JsonProperty
import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.http.HttpHeaders
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientException
import tools.jackson.core.JacksonException
import tools.jackson.databind.ObjectMapper
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import kotlin.math.round

/**
 * Fetches the yr.no forecast for the fixed race location once and writes it onto the next
 * upcoming race. The forecast is refreshed at most every 30 minutes, or every 5 minutes in
 * the last 4 hours before the race. Races that an admin has manually overridden are skipped,
 * and past races are never selected — so their last value freezes as the historical record.
 */
@Service
class WeatherService(
    private val raceRepository: RaceRepository,
    private val objectMapper: ObjectMapper,
) {
    private val logger = logger()

    private val restClient =
        RestClient
            .builder()
            .baseUrl(FORECAST_URL)
            .defaultHeader(HttpHeaders.USER_AGENT, USER_AGENT)
            .defaultHeader(HttpHeaders.ACCEPT, "application/json")
            .build()

    @Scheduled(fixedRate = REFRESH_INTERVAL_MS, initialDelay = INITIAL_DELAY_MS)
    @Transactional
    fun refreshUpcomingRaceWeather() {
        val now = LocalDateTime.now(OSLO_ZONE)
        val nextRace = raceRepository.findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(now)
        if (nextRace != null && needsRefresh(nextRace, now)) updateWeather(nextRace, now)
    }

    /** Whether the cached forecast has expired (30 min, or 5 min in the last 4 hours before the race). */
    private fun needsRefresh(
        race: RaceEntity,
        now: LocalDateTime,
    ): Boolean {
        if (race.weatherManuallyEdited) return false
        val updatedAt = race.weatherUpdatedAt
        return updatedAt == null || Duration.between(updatedAt, Instant.now()) >= ttlUntil(now, race.raceDate)
    }

    private fun updateWeather(
        race: RaceEntity,
        now: LocalDateTime,
    ) {
        val forecast = fetchForecast() ?: return
        val entry = closestEntry(forecast, race.raceDate) ?: return
        applyForecast(race, entry)
        raceRepository.save(race)
        logger.info("Updated weather for race ${race.uuid} at ${race.raceDate} (ttl=${ttlUntil(now, race.raceDate).toMinutes()}min)")
    }

    private fun ttlUntil(
        now: LocalDateTime,
        raceDate: LocalDateTime,
    ): Duration {
        val untilRace = Duration.between(now, raceDate)
        return if (!untilRace.isNegative && untilRace <= IMMINENT_WINDOW) IMMINENT_TTL else DEFAULT_TTL
    }

    private fun fetchForecast(): YrForecast? =
        try {
            val body =
                restClient
                    .get()
                    .uri { it.queryParam("lat", LAT).queryParam("lon", LON).build() }
                    .retrieve()
                    .body(String::class.java)
            body?.let { objectMapper.readValue(it, YrForecast::class.java) }
        } catch (e: RestClientException) {
            logger.warn("Failed to fetch weather forecast from yr", e)
            null
        } catch (e: JacksonException) {
            logger.warn("Failed to parse weather forecast from yr", e)
            null
        }

    /** Picks the forecast entry closest to the race hour (yr entries are UTC; races are Oslo time). */
    private fun closestEntry(
        forecast: YrForecast,
        raceDate: LocalDateTime,
    ): YrTimeseries? {
        val raceInstant = raceDate.atZone(OSLO_ZONE).toInstant().truncatedTo(ChronoUnit.HOURS)
        return forecast.properties.timeseries.minByOrNull { Duration.between(it.time, raceInstant).abs() }
    }

    private fun applyForecast(
        race: RaceEntity,
        entry: YrTimeseries,
    ) {
        val symbol =
            entry.data.next1Hours
                ?.summary
                ?.symbolCode
                ?: entry.data.next6Hours
                    ?.summary
                    ?.symbolCode
                ?: FALLBACK_SYMBOL
        val precipitation =
            entry.data.next1Hours
                ?.details
                ?.precipitationAmount
                ?: entry.data.next6Hours
                    ?.details
                    ?.precipitationAmount
                ?: FALLBACK_PRECIPITATION
        race.weatherSymbol = symbol
        race.weatherTemperature = round(entry.data.instant.details.airTemperature)
        race.weatherWindSpeed = round(entry.data.instant.details.windSpeed * WIND_ROUNDING) / WIND_ROUNDING
        race.weatherPrecipitation = precipitation
        race.weatherUpdatedAt = Instant.now()
    }

    companion object {
        private const val FORECAST_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
        private const val LAT = "59.30602"
        private const val LON = "11.0429"
        private const val USER_AGENT = "torsdagslopet.no weather-cache (eirijomine@gmail.com)"
        private const val REFRESH_INTERVAL_MS = 5L * 60L * 1000L
        private const val INITIAL_DELAY_MS = 10L * 1000L
        private const val FALLBACK_SYMBOL = "cloudy"
        private const val FALLBACK_PRECIPITATION = 0.0
        private const val WIND_ROUNDING = 10.0
        private val OSLO_ZONE: ZoneId = ZoneId.of("Europe/Oslo")
        private val IMMINENT_WINDOW: Duration = Duration.ofHours(4)
        private val IMMINENT_TTL: Duration = Duration.ofMinutes(5)
        private val DEFAULT_TTL: Duration = Duration.ofMinutes(30)
    }
}

private data class YrForecast(
    val properties: YrProperties,
)

private data class YrProperties(
    val timeseries: List<YrTimeseries>,
)

private data class YrTimeseries(
    val time: Instant,
    val data: YrData,
)

private data class YrData(
    val instant: YrInstant,
    @JsonProperty("next_1_hours") val next1Hours: YrPeriod? = null,
    @JsonProperty("next_6_hours") val next6Hours: YrPeriod? = null,
)

private data class YrInstant(
    val details: YrInstantDetails,
)

private data class YrInstantDetails(
    @JsonProperty("air_temperature") val airTemperature: Double,
    @JsonProperty("wind_speed") val windSpeed: Double,
)

private data class YrPeriod(
    val summary: YrSummary,
    val details: YrPeriodDetails? = null,
)

private data class YrSummary(
    @JsonProperty("symbol_code") val symbolCode: String,
)

private data class YrPeriodDetails(
    @JsonProperty("precipitation_amount") val precipitationAmount: Double? = null,
)
