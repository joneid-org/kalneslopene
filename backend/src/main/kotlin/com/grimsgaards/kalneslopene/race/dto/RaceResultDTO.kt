package com.grimsgaards.kalneslopene.race.dto

import com.grimsgaards.kalneslopene.runner.RunnerDTO
import java.time.Duration

data class RaceResultDTO(
    val runner: RunnerDTO,
    val resultTime: Duration?,
    val hideTime: Boolean,
    val totalRaces: Int,
    val personalBest: Duration?,
    val seasonBest: Duration?,
    val newPersonalBest: Boolean,
    val newSeasonBest: Boolean,
)
