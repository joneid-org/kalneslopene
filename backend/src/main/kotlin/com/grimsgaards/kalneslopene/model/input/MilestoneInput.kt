package com.grimsgaards.kalneslopene.model.input

import java.util.UUID

data class MilestoneInput(
    val uuid: UUID? = null,
    val year: String,
    val icon: String,
    val title: String,
    val summary: String,
    val extra: String? = null,
    val details: List<String>
)

