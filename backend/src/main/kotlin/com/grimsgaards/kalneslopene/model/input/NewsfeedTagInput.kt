package com.grimsgaards.kalneslopene.model.input

import java.util.UUID

data class NewsfeedTagInput(
    val uuid: UUID? = null,
    val label: String,
    val value: String,
    val color: String,
)

