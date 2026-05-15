package com.grimsgaards.kalneslopene.model.dto

data class RaceRunnerDTO(
    val runner: RunnerDTO,
    val race: RaceDTO,
    val resultTime: Long,
    val hideTime: Boolean = false
)
