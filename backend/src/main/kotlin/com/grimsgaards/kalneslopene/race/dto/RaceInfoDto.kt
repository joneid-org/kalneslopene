package com.grimsgaards.kalneslopene.race.dto

import java.time.LocalDateTime
import java.util.UUID

data class RaceInfoDto(
    val uuid: UUID,
    val raceDate: LocalDateTime,
)
