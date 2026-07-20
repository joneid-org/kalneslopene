package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RaceStatisticsDto
import com.grimsgaards.kalneslopene.model.dto.UniqueRunnersStats
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.MonthDay
import java.time.Year

@Service
class StatisticsService(
    private val raceRepository: RaceRepository,
) {
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
        val averageRunnersPerRace =
            if (completedRaces.isEmpty()) 0.0 else allRunners.size.toDouble() / completedRaces.size

        val courseRecord =
            allRunners
                .filter { !it.hideTime && it.resultTime != null }
                .minByOrNull { it.resultTime!! }
                ?.toDto()

        return RaceStatisticsDto(
            completedRaces = completedRaces.size,
            upcomingRaces = upcomingRaces.size,
            uniqueRunners =
                UniqueRunnersStats(
                    male = maleRunners.size,
                    female = femaleRunners.size,
                    total = uniqueRunners.size,
                ),
            averageRunnersPerRace = averageRunnersPerRace,
            courseRecord = courseRecord,
        )
    }
}
