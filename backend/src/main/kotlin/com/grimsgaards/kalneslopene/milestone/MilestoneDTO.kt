package com.grimsgaards.kalneslopene.milestone

import java.util.UUID

data class MilestoneDTO(
    val uuid: UUID,
    val year: String,
    val icon: String,
    val title: String,
    val summary: String,
    val extra: String? = null,
    val details: List<String>,
)
