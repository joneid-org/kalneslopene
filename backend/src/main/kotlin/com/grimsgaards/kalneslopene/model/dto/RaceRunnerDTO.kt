package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalTime

data class RaceRunnerDTO(
    val runner: RunnerDTO,
    val race: RaceDTO,
    val resultTime: LocalTime,
    val hideTime: Boolean = false
)
