package com.grimsgaards.kalneslopene.race.dto

import com.grimsgaards.kalneslopene.weather.WeatherDto
import java.time.LocalDateTime
import java.util.UUID

data class RaceInput(
    val uuid: UUID? = null,
    val raceDate: LocalDateTime,
    val weather: WeatherDto? = null,
    val courseCondition: String? = null,
    val weatherManuallyEdited: Boolean? = null,
)
