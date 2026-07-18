package com.grimsgaards.kalneslopene.model.dto

import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.Duration
import java.util.UUID

data class RaceRunnerDTO(
    val runner: RunnerDTO,
    val raceUuid: UUID,
    val resultTime: Duration?,
    val hideTime: Boolean = false,
    val previousSeasonBest: Duration?,
    val previousPersonalRecord: Duration?,
    val totalRaces: Int,
) {
    @JsonIgnore
    fun isNewPersonalRecord(): Boolean = resultTime != null && (previousPersonalRecord == null || resultTime < previousPersonalRecord)

    @JsonIgnore
    fun isNewSeasonBest(): Boolean = resultTime != null && (previousSeasonBest == null || resultTime < previousSeasonBest)
}
