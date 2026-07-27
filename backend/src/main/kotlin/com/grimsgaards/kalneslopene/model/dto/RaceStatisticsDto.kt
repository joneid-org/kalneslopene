package com.grimsgaards.kalneslopene.model.dto

import java.time.Duration

data class RaceStatisticsDto(
    val completedRaces: Int,
    val upcomingRaces: Int,
    val totalParticipations: ParticipationStats,
    val uniqueRunners: UniqueRunnersStats,
    val averageRunnersPerRace: Double,
    val courseRecordMale: CourseRecordDto?,
    val courseRecordFemale: CourseRecordDto?,
)

/** [raceInfo] is null when the record is a historic one, set before the earliest race we have results for. */
data class CourseRecordDto(
    val runner: RunnerDTO,
    val resultTime: Duration,
    val raceInfo: RaceInfoDto?,
)

data class UniqueRunnersStats(
    val male: Int,
    val female: Int,
    val total: Int,
)

data class ParticipationStats(
    val male: Int,
    val female: Int,
)

data class RunnerOverviewStatsDto(
    val totalRunners: Int,
    val runnersInRaces: Int,
    val firstRaceYear: Int?,
)
