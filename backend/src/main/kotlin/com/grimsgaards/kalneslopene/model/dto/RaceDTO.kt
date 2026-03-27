package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.*

data class RaceDTO(
    val uuid: UUID?,
    val raceDate: LocalDate,
    val raceTime: OffsetDateTime,
    val weather: String?
)