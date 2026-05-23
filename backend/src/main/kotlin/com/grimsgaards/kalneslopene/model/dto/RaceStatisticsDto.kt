package com.grimsgaards.kalneslopene.model.dto

data class RaceStatisticsDto(
    val completedRaces: Int,
    val upcomingRaces: Int,
    val uniqueRunners: UniqueRunnersStats,
    val averageRunnersPerRace: Double,
    val courseRecord: RaceRunnerDTO?,
)

data class UniqueRunnersStats(
    val male: Int,
    val female: Int,
    val total: Int,
)