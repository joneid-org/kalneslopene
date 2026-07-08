package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDateTime
import java.util.UUID

data class ResultDraftDTO(
    val raceUuid: UUID,
    val weather: String?,
    val entries: List<DraftEntryDTO>,
    val currentStep: Int,
    val updatedAt: LocalDateTime? = null,
)

data class DraftEntryDTO(
    val clientId: String,
    val runnerUuid: UUID?,
    val name: String,
    val gender: String,
    val resultTimeSeconds: Long?,
    val hideTime: Boolean,
    val createdThisSession: Boolean = false,
)
