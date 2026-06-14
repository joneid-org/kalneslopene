package com.grimsgaards.kalneslopene.model.input

import java.util.UUID

data class RunnerInput(
    val uuid: UUID? = null,
    val name: String,
    val gender: String,
)
