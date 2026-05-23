package com.grimsgaards.kalneslopene.model.input

import java.time.LocalDateTime
import java.util.UUID

data class RaceInput(
    val uuid: UUID? = null,
    val raceDate: LocalDateTime,
    val weather: String?
)

