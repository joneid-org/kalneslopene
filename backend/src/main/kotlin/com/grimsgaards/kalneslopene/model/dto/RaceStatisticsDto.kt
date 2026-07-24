package com.grimsgaards.kalneslopene.model.dto

data class RaceStatisticsDto(
    val completedRaces: Int,
    val upcomingRaces: Int,
    val totalParticipations: ParticipationStats,
    val uniqueRunners: UniqueRunnersStats,
    val averageRunnersPerRace: Double,
    val courseRecord: RaceRunnerDTO?,
    val courseRecordMale: RaceRunnerDTO?,
    val courseRecordFemale: RaceRunnerDTO?,
)

data class UniqueRunnersStats(
    val male: Int,
    val female: Int,
    val total: Int,
)

data class ParticipationStats(
    val male: Int,
    val female: Int,
    val total: Int,
)

data class RunnerOverviewStatsDto(
    val totalRunners: Int,
    val runnersInRaces: Int,
    val firstRaceYear: Int?,
)
