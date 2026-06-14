package com.grimsgaards.kalneslopene.model.input

import java.time.LocalDateTime

data class RaceFilter(
    val from: LocalDateTime? = null,
    val to: LocalDateTime? = null,
)
