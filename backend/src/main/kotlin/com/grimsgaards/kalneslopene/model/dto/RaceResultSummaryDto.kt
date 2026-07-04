package com.grimsgaards.kalneslopene.model.dto

data class RaceResultSummaryDto(
    val participants: Int,
    val male: Int,
    val female: Int,
    val seasonBestCount: Int,
    val personalBestCount: Int,
    val debutantCount: Int,
)
