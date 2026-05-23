package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDateTime
import java.util.*

data class RaceDTO(
    val uuid: UUID,
    val raceDate: LocalDateTime,
    val weather: String?
)