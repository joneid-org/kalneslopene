package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.ParticipationStats
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
        val now = LocalDateTime.now()
        val seasonFilter =
            RaceFilter(
                from = year?.atDay(1)?.atStartOfDay(),
                to = year?.atMonthDay(MonthDay.of(12, 31))?.atTime(LocalTime.MAX),
            )

        val seasonRaces = raceRepository.findAllByFilter(seasonFilter)
        val (completedRaces, upcomingRaces) = seasonRaces.partition { it.raceDate.isBefore(now) }
        val publishedRaces = completedRaces.filter { it.isPublished }

        val allRunners = publishedRaces.flatMap { it.runners }
        val uniqueRunners = allRunners.map { it.runner }.toSet()
        val (maleRunners, femaleRunners) = uniqueRunners.partition { it.gender == Gender.MALE }

        val (maleParticipation, femaleParticipation) = allRunners.partition { it.runner.gender == Gender.MALE }
        val averageRunnersPerRace =
            if (publishedRaces.isEmpty()) 0.0 else allRunners.size.toDouble() / publishedRaces.size

        val eligibleRunners = allRunners.filter { !it.hideTime && it.resultTime != null }
        val (maleEligibleRunners, femaleEligibleRunners) =
            eligibleRunners.partition { it.runner.gender == Gender.MALE }
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
                    male = maleParticipation.size,
                    female = femaleParticipation.size,
                    total = allRunners.size,
                ),
            uniqueRunners =
                UniqueRunnersStats(
                    male = maleRunners.size,
                    female = femaleRunners.size,
                    total = uniqueRunners.size,
                ),
            averageRunnersPerRace = averageRunnersPerRace,
            courseRecordMale = courseRecordMale,
            courseRecordFemale = courseRecordFemale,
        )
    }
}
