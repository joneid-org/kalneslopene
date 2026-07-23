package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RacePhotoEntity
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.model.input.ReorderPhotoInput
import com.grimsgaards.kalneslopene.repository.RacePhotoRepository
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import java.time.LocalDateTime
import java.time.OffsetDateTime
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
    lateinit var racePhotoRepository: RacePhotoRepository

    @Mock
    lateinit var s3Service: S3Service

    private lateinit var service: RaceService
    private val uuid: UUID = UUID.randomUUID()
    private val raceDate: LocalDateTime = LocalDateTime.parse("2026-08-13T18:00:00")

    @BeforeEach
    fun setUp() {
        service = RaceService(raceRepository, runnerRepository, raceRunnerRepository, racePhotoRepository, s3Service)
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
    }

    @Nested
    inner class ReorderPhoto {
        private fun confirmedFile(url: String) = FileEntity(url).apply { uploadConfirmedAt = OffsetDateTime.now() }

        @BeforeEach
        fun stubSave() {
            Mockito
                .`when`(racePhotoRepository.save(any(RacePhotoEntity::class.java)))
                .thenAnswer { it.getArgument<RacePhotoEntity>(0) }
        }

        @Test
        fun `moves a photo before the first photo`() {
            val race = existingRace()
            val fileA = confirmedFile("a")
            val fileB = confirmedFile("b")
            val fileC = confirmedFile("c")
            val photos =
                listOf(
                    RacePhotoEntity(race = race, file = fileA, orderIndex = 1.0),
                    RacePhotoEntity(race = race, file = fileB, orderIndex = 2.0),
                    RacePhotoEntity(race = race, file = fileC, orderIndex = 3.0),
                )
            Mockito.`when`(racePhotoRepository.findAllByRaceUuidOrderByOrderIndexAsc(uuid)).thenReturn(photos)

            val result = service.reorderPhotoInRace(uuid, ReorderPhotoInput(fileUuid = fileC.uuid, beforeFileUuid = fileA.uuid))

            assertThat(result.map { it.uuid }).containsExactly(fileC.uuid, fileA.uuid, fileB.uuid)
        }

        @Test
        fun `moves a photo after the last photo`() {
            val race = existingRace()
            val fileA = confirmedFile("a")
            val fileB = confirmedFile("b")
            val fileC = confirmedFile("c")
            val photos =
                listOf(
                    RacePhotoEntity(race = race, file = fileA, orderIndex = 1.0),
                    RacePhotoEntity(race = race, file = fileB, orderIndex = 2.0),
                    RacePhotoEntity(race = race, file = fileC, orderIndex = 3.0),
                )
            Mockito.`when`(racePhotoRepository.findAllByRaceUuidOrderByOrderIndexAsc(uuid)).thenReturn(photos)

            val result = service.reorderPhotoInRace(uuid, ReorderPhotoInput(fileUuid = fileA.uuid, afterFileUuid = fileC.uuid))

            assertThat(result.map { it.uuid }).containsExactly(fileB.uuid, fileC.uuid, fileA.uuid)
        }

        @Test
        fun `throws when both beforeFileUuid and afterFileUuid are set`() {
            assertThatThrownBy {
                service.reorderPhotoInRace(
                    uuid,
                    ReorderPhotoInput(fileUuid = UUID.randomUUID(), beforeFileUuid = UUID.randomUUID(), afterFileUuid = UUID.randomUUID()),
                )
            }.isInstanceOf(IllegalArgumentException::class.java)
        }

        @Test
        fun `throws when neither beforeFileUuid nor afterFileUuid are set`() {
            assertThatThrownBy {
                service.reorderPhotoInRace(uuid, ReorderPhotoInput(fileUuid = UUID.randomUUID()))
            }.isInstanceOf(IllegalArgumentException::class.java)
        }
    }
}
