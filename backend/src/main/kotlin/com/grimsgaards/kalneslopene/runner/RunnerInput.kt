package com.grimsgaards.kalneslopene.runner

import java.util.UUID

data class RunnerInput(
    val uuid: UUID? = null,
    val name: String,
    val gender: String,
    val isVerified: Boolean = false,
)
