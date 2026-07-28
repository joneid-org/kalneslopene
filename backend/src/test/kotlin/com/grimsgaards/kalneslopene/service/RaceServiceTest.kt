package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import com.grimsgaards.kalneslopene.model.entities.FileEntity
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RacePhotoEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.model.input.RaceFilter
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
import org.mockito.ArgumentCaptor
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.Mockito.anyList
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import java.time.Duration
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
    inner class NextRace {
        private fun stubNextRace(race: RaceEntity?) {
            val anyDateTime = any(LocalDateTime::class.java) ?: LocalDateTime.MIN
            Mockito
                .`when`(raceRepository.findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(anyDateTime))
                .thenReturn(race)
        }

        @Test
        fun `returns the first upcoming race`() {
            val race = existingRace()
            stubNextRace(race)

            val dto = service.findNextRace()

            assertThat(dto?.uuid).isEqualTo(race.uuid)
            assertThat(dto?.raceDate).isEqualTo(raceDate)
        }

        @Test
        fun `returns null when no race is upcoming`() {
            stubNextRace(null)

            assertThat(service.findNextRace()).isNull()
        }
    }

    @Nested
    inner class GetAll {
        private fun capturePageable(
            filter: RaceFilter,
            page: Int = 0,
            pageSize: Int? = null,
        ): Pageable {
            Mockito
                .`when`(
                    raceRepository.findAllByFilter(
                        any(RaceFilter::class.java) ?: filter,
                        any(Pageable::class.java) ?: Pageable.unpaged(),
                    ),
                ).thenReturn(PageImpl(emptyList()))

            service.getAll(filter, page, pageSize)

            val captor = ArgumentCaptor.forClass(Pageable::class.java)
            Mockito.verify(raceRepository).findAllByFilter(any(RaceFilter::class.java) ?: filter, captor.capture() ?: Pageable.unpaged())
            return captor.value
        }

        @Test
        fun `uses the requested page size`() {
            val pageable = capturePageable(RaceFilter(), page = 2, pageSize = 5)

            assertThat(pageable.isPaged).isTrue()
            assertThat(pageable.pageNumber).isEqualTo(2)
            assertThat(pageable.pageSize).isEqualTo(5)
        }

        @Test
        fun `allows the maximum page size`() {
            assertThat(capturePageable(RaceFilter(), pageSize = MAX_RACE_PAGE_SIZE).pageSize).isEqualTo(MAX_RACE_PAGE_SIZE)
        }

        @Test
        fun `throws when page size exceeds the maximum`() {
            assertThatThrownBy { service.getAll(RaceFilter(), 0, MAX_RACE_PAGE_SIZE + 1) }
                .isInstanceOf(IllegalArgumentException::class.java)
        }

        @Test
        fun `throws when page size is not positive`() {
            assertThatThrownBy { service.getAll(RaceFilter(), 0, 0) }
                .isInstanceOf(IllegalArgumentException::class.java)
        }

        @Test
        fun `omitting page size is unpaged when the filter stays within one year`() {
            val filter =
                RaceFilter(
                    from = LocalDateTime.parse("2026-01-01T00:00:00"),
                    to = LocalDateTime.parse("2026-12-31T23:59:59"),
                )

            assertThat(capturePageable(filter).isUnpaged).isTrue()
        }

        @Test
        fun `throws when page size is omitted and the filter spans several years`() {
            val filter =
                RaceFilter(
                    from = LocalDateTime.parse("2025-01-01T00:00:00"),
                    to = LocalDateTime.parse("2026-12-31T23:59:59"),
                )

            assertThatThrownBy { service.getAll(filter, 0, null) }.isInstanceOf(IllegalArgumentException::class.java)
        }

        @Test
        fun `throws when page size is omitted and the filter has no bounds`() {
            assertThatThrownBy { service.getAll(RaceFilter(from = LocalDateTime.parse("2026-01-01T00:00:00")), 0, null) }
                .isInstanceOf(IllegalArgumentException::class.java)
        }
    }

    @Nested
    inner class PublishRace {
        private fun raceWithRunner(
            resultTime: Duration?,
            hideTime: Boolean,
        ) = existingRace().apply {
            runners.add(
                RaceRunnerEntity(
                    runner = RunnerEntity(name = "Maren Paulsrud Andersen", gender = Gender.FEMALE),
                    race = this,
                    resultTime = resultTime,
                    hideTime = hideTime,
                ),
            )
        }

        @Test
        fun `publishes a race where a runner only participated`() {
            stubExisting(raceWithRunner(resultTime = null, hideTime = true))

            assertThat(service.publishRace(uuid).isPublished).isTrue()
        }

        @Test
        fun `publishes a participated runner whose stored time is zero`() {
            stubExisting(raceWithRunner(resultTime = Duration.ZERO, hideTime = true))

            assertThat(service.publishRace(uuid).isPublished).isTrue()
        }

        @Test
        fun `rejects a runner without a time`() {
            stubExisting(raceWithRunner(resultTime = Duration.ZERO, hideTime = false))

            assertThatThrownBy { service.publishRace(uuid) }
                .isInstanceOf(IllegalArgumentException::class.java)
                .hasMessageContaining("Maren Paulsrud Andersen")
        }
    }

    @Nested
    inner class AddRunnersToRace {
        @Test
        fun `stores no time for a runner who only participated`() {
            val race = existingRace()
            val runner = RunnerEntity(name = "Maren Paulsrud Andersen", gender = Gender.FEMALE)
            Mockito.`when`(raceRepository.findById(uuid)).thenReturn(Optional.of(race))
            Mockito.`when`(runnerRepository.findAllById(listOf(runner.uuid))).thenReturn(listOf(runner))
            Mockito
                .`when`(raceRunnerRepository.saveAll(anyList<RaceRunnerEntity>()))
                .thenAnswer { it.getArgument<List<RaceRunnerEntity>>(0) }

            val template = RaceRunnerEntity(runner = runner, race = race, resultTime = Duration.ZERO, hideTime = true)
            val saved = service.addRunnersToRace(uuid, listOf(template.toDto()))

            assertThat(saved.single().resultTime).isNull()
            assertThat(saved.single().hideTime).isTrue()
        }
    }

    @Nested
    inner class UpdateRunnerInRace {
        @Test
        fun `clears the stored time when the runner only participated`() {
            val race = existingRace()
            val runner = RunnerEntity(name = "Maren Paulsrud Andersen", gender = Gender.FEMALE)
            val entity = RaceRunnerEntity(runner = runner, race = race, resultTime = Duration.ofMinutes(20))
            val key = RaceRunnerKey(runnerUuid = runner.uuid, raceUuid = uuid)
            Mockito.`when`(raceRunnerRepository.findById(key)).thenReturn(Optional.of(entity))
            Mockito
                .`when`(raceRunnerRepository.save(any(RaceRunnerEntity::class.java)))
                .thenAnswer { it.getArgument<RaceRunnerEntity>(0) }

            val dto =
                service.updateRunnerInRace(
                    uuid,
                    runner.uuid,
                    entity.toDto().copy(resultTime = Duration.ZERO, hideTime = true),
                )

            assertThat(dto.resultTime).isNull()
            assertThat(dto.hideTime).isTrue()
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
