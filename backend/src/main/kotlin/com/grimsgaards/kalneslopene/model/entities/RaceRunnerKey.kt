package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.UUID

@Embeddable
data class RaceRunnerKey(
    val runnerUuid: UUID = UUID.randomUUID(),
    val raceUuid: UUID = UUID.randomUUID(),
) : Serializable
