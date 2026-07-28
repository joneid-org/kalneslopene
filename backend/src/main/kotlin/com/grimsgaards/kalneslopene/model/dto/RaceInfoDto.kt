package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDateTime
import java.util.UUID

data class RaceInfoDto(
    val uuid: UUID,
    val raceDate: LocalDateTime,
)
