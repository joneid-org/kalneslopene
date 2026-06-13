package com.grimsgaards.kalneslopene.model.dto

import java.util.*

data class MilestoneDTO(
    val uuid: UUID,
    val year: String,
    val icon: String,
    val title: String,
    val summary: String,
    val extra: String? = null,
    val details: List<String>,
)
