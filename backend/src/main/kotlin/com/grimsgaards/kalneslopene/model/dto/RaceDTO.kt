package com.grimsgaards.kalneslopene.model.dto

import java.time.OffsetDateTime
import java.util.*

data class RaceDTO(
    val uuid: UUID?,
    val raceDate: OffsetDateTime,
    val weather: String?
)