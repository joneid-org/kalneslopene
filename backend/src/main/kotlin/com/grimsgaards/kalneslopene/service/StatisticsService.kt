package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.ParticipationStats
import com.grimsgaards.kalneslopene.model.dto.RaceStatisticsDto
import com.grimsgaards.kalneslopene.model.dto.RunnerOverviewStatsDto
import com.grimsgaards.kalneslopene.model.dto.UniqueRunnersStats
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
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
    fun getRunnerOverviewStats(): RunnerOverviewStatsDto {
        val races = raceRepository.findAllByFilter(RaceFilter(isPublished = true))
        val runnersInRaces =
            races
                .flatMap { it.runners }
                .map { it.runner }
                .toSet()
                .size
        val firstRaceYear = races.minByOrNull { it.raceDate }?.raceDate?.year

        return RunnerOverviewStatsDto(
            totalRunners = runnerRepository.count().toInt(),
            runnersInRaces = runnersInRaces,
            firstRaceYear = firstRaceYear,
        )
    }

    fun getRaceStatistics(year: Year?): RaceStatisticsDto {
        val filter =
            RaceFilter(
                from = year?.atDay(1)?.atStartOfDay(),
                to = year?.atMonthDay(MonthDay.of(12, 31))?.atTime(LocalTime.MAX),
                isPublished = true,
            )
        val races = raceRepository.findAllByFilter(filter)
        val allRunners = races.flatMap { it.runners }

        val (completedRaces, upcomingRaces) = races.partition { it.raceDate.isBefore(LocalDateTime.now()) }
        val uniqueRunners = allRunners.map { it.runner }.toSet()
        val (maleRunners, femaleRunners) = uniqueRunners.partition { it.gender == Gender.MALE }
        val (maleParticipations, femaleParticipations) =
            allRunners.partition { it.runner.gender == Gender.MALE }
        val averageRunnersPerRace =
            if (completedRaces.isEmpty()) 0.0 else allRunners.size.toDouble() / completedRaces.size

        val eligibleRunners = allRunners.filter { !it.hideTime && it.resultTime != null }
        val (maleEligibleRunners, femaleEligibleRunners) =
            eligibleRunners.partition { it.runner.gender == Gender.MALE }
        val courseRecord =
            eligibleRunners
                .minByOrNull { it.resultTime!! }
                ?.toDto()
        val courseRecordMale =
            maleEligibleRunners
                .minByOrNull { it.resultTime!! }
                ?.toDto()
        val courseRecordFemale =
            femaleEligibleRunners
                .minByOrNull { it.resultTime!! }
                ?.toDto()

        return RaceStatisticsDto(
            completedRaces = completedRaces.size,
            upcomingRaces = upcomingRaces.size,
            totalParticipations =
                ParticipationStats(
                    male = maleParticipations.size,
                    female = femaleParticipations.size,
                    total = allRunners.size,
                ),
            uniqueRunners =
                UniqueRunnersStats(
                    male = maleRunners.size,
                    female = femaleRunners.size,
                    total = uniqueRunners.size,
                ),
            averageRunnersPerRace = averageRunnersPerRace,
            courseRecord = courseRecord,
            courseRecordMale = courseRecordMale,
            courseRecordFemale = courseRecordFemale,
        )
    }
}
