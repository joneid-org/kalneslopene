package com.grimsgaards.kalneslopene.model.dto

import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.Duration
import java.time.LocalDateTime
import java.util.UUID

data class RaceRunnerDTO(
    val runner: RunnerDTO,
    val raceInfo: RaceInfoDto,
    val resultTime: Duration?,
    val hideTime: Boolean = false,
    val previousSeasonBest: Duration?,
    val previousPersonalRecord: Duration?,
    val totalRaces: Int,
    val seasonRaces: Int,
) {
    @JsonIgnore
    fun isNewPersonalRecord(): Boolean = resultTime != null && (previousPersonalRecord == null || resultTime < previousPersonalRecord)

    @JsonIgnore
    fun isNewSeasonBest(): Boolean = resultTime != null && (previousSeasonBest == null || resultTime < previousSeasonBest)
}

data class RaceInfoDto(
    val uuid: UUID,
    val raceDate: LocalDateTime,
)
