package com.grimsgaards.kalneslopene.model.input

import com.grimsgaards.kalneslopene.model.dto.WeatherDto
import java.time.LocalDateTime
import java.util.UUID

data class RaceInput(
    val uuid: UUID? = null,
    val raceDate: LocalDateTime,
    val weather: WeatherDto? = null,
    val courseCondition: String? = null,
    val weatherManuallyEdited: Boolean? = null,
)
