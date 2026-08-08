package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.race.dto.RaceFilter
import com.grimsgaards.kalneslopene.race.model.RaceEntity
import com.grimsgaards.kalneslopene.race.model.RaceRepository
import com.grimsgaards.kalneslopene.race.model.RaceRunnerEntity
import com.grimsgaards.kalneslopene.runner.Gender
import com.grimsgaards.kalneslopene.runner.RunnerEntity
import com.grimsgaards.kalneslopene.runner.RunnerRepository
import com.grimsgaards.kalneslopene.statistics.StatisticsService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import java.time.Duration
import java.time.LocalDateTime
import java.time.Year

@MockitoSettings(strictness = Strictness.LENIENT)
class StatisticsServiceTest {
    @Mock
    lateinit var raceRepository: RaceRepository

    @Mock
    lateinit var runnerRepository: RunnerRepository

    private lateinit var service: StatisticsService

    @BeforeEach
    fun setUp() {
        service = StatisticsService(raceRepository, runnerRepository)
    }

    private val past: LocalDateTime = LocalDateTime.now().minusDays(7)
    private val future: LocalDateTime = LocalDateTime.now().plusDays(7)

    private fun runner(gender: Gender) = RunnerEntity(name = "Runner", gender = gender)

    private fun race(
        date: LocalDateTime,
        published: Boolean = true,
    ) = RaceEntity(raceDate = date, isPublished = published)

    private fun addRunner(
        race: RaceEntity,
        runner: RunnerEntity,
        resultTime: Duration? = Duration.ofMinutes(20),
        hideTime: Boolean = false,
    ) {
        race.runners.add(
            RaceRunnerEntity(runner = runner, race = race, resultTime = resultTime, hideTime = hideTime),
        )
    }

    private fun anyFilter(): RaceFilter = any(RaceFilter::class.java) ?: RaceFilter()

    private fun anyPageable(): Pageable = any(Pageable::class.java) ?: Pageable.unpaged()

    private fun stubRaces(vararg races: RaceEntity) {
        Mockito
            .`when`(raceRepository.findAllByFilter(anyFilter(), anyPageable()))
            .thenReturn(PageImpl(races.toList()))
    }

    private fun stubHistoricRecord(
        gender: Gender,
        record: Duration,
        name: String = "Historic",
    ) {
        Mockito
            .`when`(runnerRepository.findFastestHistoricRunner(gender))
            .thenReturn(RunnerEntity(name = name, gender = gender, historicPersonalRecord = record))
    }

    @Nested
    inner class RaceCounts {
        @Test
        fun `partitions races into completed and upcoming by date`() {
            stubRaces(race(past), race(past), race(future))

            val stats = service.getRaceStatistics(null)

            assertThat(stats.completedRaces).isEqualTo(2)
            assertThat(stats.upcomingRaces).isEqualTo(1)
        }

        @Test
        fun `excludes unpublished completed races from completedRaces`() {
            stubRaces(race(past, published = true), race(past, published = false))

            val stats = service.getRaceStatistics(null)

            assertThat(stats.completedRaces).isEqualTo(1)
        }
    }

    @Nested
    inner class RunnerStatistics {
        @Test
        fun `only published completed races contribute runners`() {
            val published = race(past, published = true)
            addRunner(published, runner(Gender.MALE))
            val unpublished = race(past, published = false)
            addRunner(unpublished, runner(Gender.FEMALE))
            stubRaces(published, unpublished)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.totalParticipations.male).isEqualTo(1)
            assertThat(stats.totalParticipations.female).isEqualTo(0)
            assertThat(stats.uniqueRunners.total).isEqualTo(1)
        }

        @Test
        fun `upcoming races do not contribute runners`() {
            val upcoming = race(future, published = true)
            addRunner(upcoming, runner(Gender.MALE))
            stubRaces(upcoming)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.totalParticipations.male).isEqualTo(0)
            assertThat(stats.uniqueRunners.total).isEqualTo(0)
        }

        @Test
        fun `total participations count every entry while unique runners are deduplicated`() {
            val sharedRunner = runner(Gender.MALE)
            val raceA = race(past)
            addRunner(raceA, sharedRunner)
            val raceB = race(past)
            addRunner(raceB, sharedRunner)
            addRunner(raceB, runner(Gender.FEMALE))
            stubRaces(raceA, raceB)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.totalParticipations.male).isEqualTo(2)
            assertThat(stats.totalParticipations.female).isEqualTo(1)
            assertThat(stats.uniqueRunners.male).isEqualTo(1)
            assertThat(stats.uniqueRunners.female).isEqualTo(1)
            assertThat(stats.uniqueRunners.total).isEqualTo(2)
        }
    }

    @Nested
    inner class AverageRunnersPerRace {
        @Test
        fun `is zero when there are no published races`() {
            stubRaces(race(past, published = false), race(future))

            val stats = service.getRaceStatistics(null)

            assertThat(stats.averageRunnersPerRace).isEqualTo(0.0)
        }

        @Test
        fun `divides total participations by number of published races`() {
            val raceA = race(past)
            addRunner(raceA, runner(Gender.MALE))
            addRunner(raceA, runner(Gender.FEMALE))
            addRunner(raceA, runner(Gender.MALE))
            val raceB = race(past)
            addRunner(raceB, runner(Gender.FEMALE))
            val unpublished = race(past, published = false)
            repeat(10) { addRunner(unpublished, runner(Gender.MALE)) }
            stubRaces(raceA, raceB, unpublished)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.averageRunnersPerRace).isEqualTo(2.0)
        }
    }

    @Nested
    inner class CourseRecords {
        @Test
        fun `picks the fastest eligible runner per gender`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(25))
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(19))
            addRunner(race, runner(Gender.FEMALE), resultTime = Duration.ofMinutes(30))
            addRunner(race, runner(Gender.FEMALE), resultTime = Duration.ofMinutes(22))
            stubRaces(race)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordMale?.resultTime).isEqualTo(Duration.ofMinutes(19))
            assertThat(stats.courseRecordFemale?.resultTime).isEqualTo(Duration.ofMinutes(22))
        }

        @Test
        fun `ignores runners with hidden times`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(15), hideTime = true)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(21))
            stubRaces(race)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordMale?.resultTime).isEqualTo(Duration.ofMinutes(21))
        }

        @Test
        fun `ignores runners without a result time`() {
            val race = race(past)
            addRunner(race, runner(Gender.FEMALE), resultTime = null)
            addRunner(race, runner(Gender.FEMALE), resultTime = Duration.ofMinutes(24))
            stubRaces(race)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordFemale?.resultTime).isEqualTo(Duration.ofMinutes(24))
        }

        @Test
        fun `is null when no eligible runners exist for a gender`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(20))
            stubRaces(race)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordMale).isNotNull()
            assertThat(stats.courseRecordFemale).isNull()
        }

        @Test
        fun `includes the race the record was set in`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(20))
            stubRaces(race)

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordMale?.raceInfo?.uuid).isEqualTo(race.uuid)
        }
    }

    @Nested
    inner class HistoricCourseRecords {
        @Test
        fun `a historic personal record beats a slower recorded result`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(20))
            stubRaces(race)
            stubHistoricRecord(Gender.MALE, Duration.ofMinutes(17), name = "Gammel Rekordholder")

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordMale?.resultTime).isEqualTo(Duration.ofMinutes(17))
            assertThat(stats.courseRecordMale?.runner?.name).isEqualTo("Gammel Rekordholder")
            assertThat(stats.courseRecordMale?.raceInfo).isNull()
        }

        @Test
        fun `a faster recorded result beats the historic personal record`() {
            val race = race(past)
            addRunner(race, runner(Gender.FEMALE), resultTime = Duration.ofMinutes(18))
            stubRaces(race)
            stubHistoricRecord(Gender.FEMALE, Duration.ofMinutes(21))

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordFemale?.resultTime).isEqualTo(Duration.ofMinutes(18))
            assertThat(stats.courseRecordFemale?.raceInfo).isNotNull()
        }

        @Test
        fun `is used when no races have eligible results`() {
            stubRaces(race(past))
            stubHistoricRecord(Gender.FEMALE, Duration.ofMinutes(23))

            val stats = service.getRaceStatistics(null)

            assertThat(stats.courseRecordFemale?.resultTime).isEqualTo(Duration.ofMinutes(23))
            assertThat(stats.courseRecordMale).isNull()
        }

        @Test
        fun `are excluded when statistics are scoped to a single year`() {
            val race = race(past)
            addRunner(race, runner(Gender.MALE), resultTime = Duration.ofMinutes(20))
            stubRaces(race)
            stubHistoricRecord(Gender.MALE, Duration.ofMinutes(17))

            val stats = service.getRaceStatistics(Year.of(past.year))

            assertThat(stats.courseRecordMale?.resultTime).isEqualTo(Duration.ofMinutes(20))
        }
    }

    @Nested
    inner class SeasonFilter {
        @Test
        fun `passes the year bounds to the repository filter`() {
            stubRaces(race(past))
            val captor = org.mockito.ArgumentCaptor.forClass(RaceFilter::class.java)

            service.getRaceStatistics(Year.of(2025))

            Mockito.verify(raceRepository).findAllByFilter(captor.capture() ?: RaceFilter(), anyPageable())
            assertThat(captor.value.from).isEqualTo(LocalDateTime.parse("2025-01-01T00:00:00"))
            assertThat(
                captor.value.to
                    ?.toLocalDate()
                    .toString(),
            ).isEqualTo("2025-12-31")
        }

        @Test
        fun `uses an unbounded filter when no year is given`() {
            stubRaces(race(past))
            val captor = org.mockito.ArgumentCaptor.forClass(RaceFilter::class.java)

            service.getRaceStatistics(null)

            Mockito.verify(raceRepository).findAllByFilter(captor.capture() ?: RaceFilter(), anyPageable())
            assertThat(captor.value.from).isNull()
            assertThat(captor.value.to).isNull()
        }
    }
}
