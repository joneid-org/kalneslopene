package com.grimsgaards.kalneslopene.model.dto

import kotlin.time.Duration

data class RaceRunnerDTO(
    val runner: RunnerDTO,
    val race: RaceDTO,
    val resultTime: Duration,
    val hideTime: Boolean = false
)
