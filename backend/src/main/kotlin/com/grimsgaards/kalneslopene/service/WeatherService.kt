package com.grimsgaards.kalneslopene.service

import com.fasterxml.jackson.annotation.JsonProperty
import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpRequest
import org.springframework.http.HttpStatus
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientException
import tools.jackson.core.JacksonException
import tools.jackson.databind.ObjectMapper
import java.io.InputStream
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.zip.GZIPInputStream
import java.util.zip.InflaterInputStream
import kotlin.math.round

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
            .defaultHeader(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate")
            .requestInterceptor(GzipDecompressingInterceptor)
            .build()

    @Volatile private var cachedForecast: YrForecast? = null

    @Volatile private var cachedLastModified: String? = null

    @Volatile private var cacheExpiresAt: Instant? = null

    @Scheduled(fixedRate = REFRESH_INTERVAL_MS, initialDelay = INITIAL_DELAY_MS)
    @Transactional
    fun refreshUpcomingRaceWeather() {
        val now = LocalDateTime.now(OSLO_ZONE)
        val nextRace = raceRepository.findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(now)
        if (nextRace == null || !nextRace.allowWeatherAutoUpdates()) return

        val refetched = if (forecastCacheExpired()) refreshForecastCache() else false
        val needsApply = refetched || nextRace.weatherUpdatedAt == null
        val entry = cachedForecast?.takeIf { needsApply }?.let { closestEntry(it, nextRace.raceDate) }
        entry?.let {
            applyForecast(nextRace, it)
            raceRepository.save(nextRace)
            logger.info("Updated weather for race ${nextRace.uuid} at ${nextRace.raceDate}")
        }
    }

    private fun forecastCacheExpired(): Boolean {
        val expiresAt = cacheExpiresAt
        return cachedForecast == null || expiresAt == null || !Instant.now().isBefore(expiresAt)
    }

    /**
     * Refetches the forecast honouring the yr.no caching rules. Returns whether new forecast
     * data was received (as opposed to a 304 Not Modified, or a failed request).
     */
    private fun refreshForecastCache(): Boolean =
        try {
            val request = restClient.get().uri { it.queryParam("lat", LAT).queryParam("lon", LON).build() }
            cachedLastModified?.let { request.header(HttpHeaders.IF_MODIFIED_SINCE, it) }
            val response = request.retrieve().toEntity(String::class.java)

            val expires = response.headers.expires
            cacheExpiresAt = if (expires > 0) Instant.ofEpochMilli(expires) else Instant.now().plus(FALLBACK_TTL)

            val body = response.body
            if (response.statusCode.value() == HttpStatus.NOT_MODIFIED.value() || body == null) {
                false
            } else {
                cachedForecast = objectMapper.readValue(body, YrForecast::class.java)
                cachedLastModified = response.headers.getFirst(HttpHeaders.LAST_MODIFIED)
                true
            }
        } catch (e: RestClientException) {
            logger.warn("Failed to fetch weather forecast from yr", e)
            false
        } catch (e: JacksonException) {
            logger.warn("Failed to parse weather forecast from yr", e)
            false
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

        // yr.no ToS: coordinates must be truncated to max 4 decimals, or the request gets a 403.
        private const val LAT = "59.3060"
        private const val LON = "11.0429"
        private const val USER_AGENT = "torsdagslopet.no weather-cache (eirijomine@gmail.com)"
        private const val REFRESH_INTERVAL_MS = 5L * 60L * 1000L
        private const val INITIAL_DELAY_MS = 10L * 1000L
        private const val FALLBACK_SYMBOL = "cloudy"
        private const val FALLBACK_PRECIPITATION = 0.0
        private const val WIND_ROUNDING = 10.0
        private val OSLO_ZONE: ZoneId = ZoneId.of("Europe/Oslo")

        // Only used if yr.no ever omits the Expires header, which the compact endpoint always sends in practice.
        private val FALLBACK_TTL: Duration = Duration.ofMinutes(30)
    }
}

/** yr.no requires clients to support gzip; the JDK HTTP client backing RestClient does not decompress automatically. */
private object GzipDecompressingInterceptor : ClientHttpRequestInterceptor {
    override fun intercept(
        request: HttpRequest,
        body: ByteArray,
        execution: ClientHttpRequestExecution,
    ): ClientHttpResponse = GzipDecompressingResponse(execution.execute(request, body))
}

private class GzipDecompressingResponse(
    private val delegate: ClientHttpResponse,
) : ClientHttpResponse by delegate {
    override fun getBody(): InputStream =
        when (delegate.headers.getFirst(HttpHeaders.CONTENT_ENCODING)?.lowercase()) {
            "gzip" -> GZIPInputStream(delegate.body)
            "deflate" -> InflaterInputStream(delegate.body)
            else -> delegate.body
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
