package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDate
import java.time.LocalTime

data class RacePatchDTO(
    val raceDate: LocalDate? = null,
    val raceTime: LocalTime? = null,
    val weather: String? = null
)

