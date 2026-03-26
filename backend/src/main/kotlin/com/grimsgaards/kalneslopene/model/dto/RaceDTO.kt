package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDate
import java.time.LocalTime
import java.util.*

data class RaceDTO(
    val uuid: UUID? = null,
    val raceDate: LocalDate,
    val raceTime: LocalTime,
    val weather: String?
)