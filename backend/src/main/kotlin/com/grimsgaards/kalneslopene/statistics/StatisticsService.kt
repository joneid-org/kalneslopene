package com.grimsgaards.kalneslopene.statistics

import com.grimsgaards.kalneslopene.race.dto.RaceFilter
import com.grimsgaards.kalneslopene.race.dto.RaceInfoDto
import com.grimsgaards.kalneslopene.race.model.RaceRepository
import com.grimsgaards.kalneslopene.race.model.RaceRunnerEntity
import com.grimsgaards.kalneslopene.runner.Gender
import com.grimsgaards.kalneslopene.runner.RunnerRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.MonthDay
import java.time.Year

@Service
class StatisticsService(
    private val raceRepository: RaceRepository,
    private val runnerRepository: RunnerRepository,
) {
    fun getRunnerOverviewStats(): RunnerOverviewStatsDto =
        RunnerOverviewStatsDto(
            totalRunners = runnerRepository.count().toInt(),
            runnersInRaces = runnerRepository.countRunnersWithAtLeastOneRace().toInt(),
            firstRaceYear = raceRepository.findEarliestPublishedRaceDate()?.year,
        )

    fun getRaceStatistics(year: Year?): RaceStatisticsDto {
        val now = LocalDateTime.now()
        val seasonFilter =
            RaceFilter(
                from = year?.atDay(1)?.atStartOfDay(),
                to = year?.atMonthDay(MonthDay.of(12, 31))?.atTime(LocalTime.MAX),
            )

        val seasonRaces = raceRepository.findAllByFilter(seasonFilter, Pageable.unpaged()).content
        val (completedRaces, upcomingRaces) = seasonRaces.partition { it.raceDate.isBefore(now) }
        val publishedRaces = completedRaces.filter { it.isPublished }

        val allRunners = publishedRaces.flatMap { it.runners }
        val uniqueRunners = allRunners.map { it.runner }.toSet()
        val (maleRunners, femaleRunners) = uniqueRunners.partition { it.gender == Gender.MALE }

        val (maleParticipation, femaleParticipation) = allRunners.partition { it.runner.gender == Gender.MALE }
        val averageRunnersPerRace =
            if (publishedRaces.isEmpty()) 0.0 else allRunners.size.toDouble() / publishedRaces.size

        val includeHistoricRecords = year == null

        return RaceStatisticsDto(
            completedRaces = publishedRaces.size,
            upcomingRaces = upcomingRaces.size,
            totalParticipations =
                ParticipationStats(
                    male = maleParticipation.size,
                    female = femaleParticipation.size,
                ),
            uniqueRunners =
                UniqueRunnersStats(
                    male = maleRunners.size,
                    female = femaleRunners.size,
                    total = uniqueRunners.size,
                ),
            averageRunnersPerRace = averageRunnersPerRace,
            courseRecordMale = courseRecord(allRunners, Gender.MALE, includeHistoricRecords),
            courseRecordFemale = courseRecord(allRunners, Gender.FEMALE, includeHistoricRecords),
        )
    }

    private fun courseRecord(
        raceRunners: List<RaceRunnerEntity>,
        gender: Gender,
        includeHistoricRecords: Boolean,
    ): CourseRecordDto? =
        listOfNotNull(
            fastestRaceResult(raceRunners, gender),
            if (includeHistoricRecords) fastestHistoricRecord(gender) else null,
        ).minByOrNull { it.resultTime }

    private fun fastestRaceResult(
        raceRunners: List<RaceRunnerEntity>,
        gender: Gender,
    ): CourseRecordDto? =
        raceRunners
            .asSequence()
            .filter { it.runner.gender == gender && !it.hideTime }
            .mapNotNull { raceRunner -> raceRunner.resultTime?.let { raceRunner to it } }
            .minByOrNull { (_, resultTime) -> resultTime }
            ?.let { (raceRunner, resultTime) ->
                CourseRecordDto(
                    runner = raceRunner.runner.toDto(),
                    resultTime = resultTime,
                    raceInfo = RaceInfoDto(uuid = raceRunner.race.uuid, raceDate = raceRunner.race.raceDate),
                )
            }

    private fun fastestHistoricRecord(gender: Gender): CourseRecordDto? =
        runnerRepository
            .findFastestHistoricRunner(gender)
            ?.let { runner ->
                runner.historicPersonalRecord?.let {
                    CourseRecordDto(runner = runner.toDto(), resultTime = it, raceInfo = null)
                }
            }
}
