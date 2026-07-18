package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import java.time.LocalDateTime
import java.util.Optional
import java.util.UUID

@MockitoSettings(strictness = Strictness.LENIENT)
class RaceServiceTest {
    @Mock
    lateinit var raceRepository: RaceRepository

    @Mock
    lateinit var runnerRepository: RunnerRepository

    @Mock
    lateinit var raceRunnerRepository: RaceRunnerRepository

    @Mock
    lateinit var s3Service: S3Service

    private lateinit var service: RaceService
    private val uuid: UUID = UUID.randomUUID()
    private val raceDate: LocalDateTime = LocalDateTime.parse("2026-08-13T18:00:00")

    @BeforeEach
    fun setUp() {
        service = RaceService(raceRepository, runnerRepository, raceRunnerRepository, s3Service)
        Mockito.`when`(raceRepository.save(any(RaceEntity::class.java))).thenAnswer { it.getArgument<RaceEntity>(0) }
    }

    private fun existingRace(manuallyEdited: Boolean = false) =
        RaceEntity(raceDate = raceDate).apply {
            weatherSymbol = "cloudy"
            weatherTemperature = 10.0
            weatherWindSpeed = 2.0
            weatherPrecipitation = 0.0
            weatherManuallyEdited = manuallyEdited
        }

    private fun stubExisting(race: RaceEntity) {
        Mockito.`when`(raceRepository.findById(uuid)).thenReturn(Optional.of(race))
    }

    @Nested
    inner class WeatherOverride {
        @Test
        fun `changing weather locks the race out of automatic updates`() {
            stubExisting(existingRace())

            val dto =
                service.updateRace(
                    uuid,
                    RaceInput(raceDate = raceDate, weather = WeatherDto("clearsky_day", 20.0, 3.0, 0.0)),
                )

            assertThat(dto.weatherManuallyEdited).isTrue()
            assertThat(dto.weather?.symbol).isEqualTo("clearsky_day")
            assertThat(dto.weather?.temperature).isEqualTo(20.0)
        }

        @Test
        fun `resubmitting unchanged weather does not lock`() {
            stubExisting(existingRace())

            val dto =
                service.updateRace(
                    uuid,
                    RaceInput(raceDate = raceDate, weather = WeatherDto("cloudy", 10.0, 2.0, 0.0)),
                )

            assertThat(dto.weatherManuallyEdited).isFalse()
        }

        @Test
        fun `editing only course condition does not lock`() {
            stubExisting(existingRace())

            val dto =
                service.updateRace(
                    uuid,
                    RaceInput(raceDate = raceDate, weather = null, courseCondition = "Vått"),
                )

            assertThat(dto.weatherManuallyEdited).isFalse()
            assertThat(dto.courseCondition).isEqualTo("Vått")
            assertThat(dto.weather?.symbol).isEqualTo("cloudy")
        }

        @Test
        fun `sending weatherManuallyEdited false resumes automatic updates`() {
            stubExisting(existingRace(manuallyEdited = true))

            val dto =
                service.updateRace(
                    uuid,
                    RaceInput(raceDate = raceDate, weatherManuallyEdited = false),
                )

            assertThat(dto.weatherManuallyEdited).isFalse()
        }
    }
}
