package com.grimsgaards.kalneslopene.race.dto

data class RaceResultSummaryDto(
    val participants: Int,
    val male: Int,
    val female: Int,
    val seasonBestCount: Int,
    val personalBestCount: Int,
    val debutantCount: Int,
)
