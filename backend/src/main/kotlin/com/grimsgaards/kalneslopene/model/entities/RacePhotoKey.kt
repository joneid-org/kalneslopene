package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.UUID

@Embeddable
data class RacePhotoKey(
    val raceUuid: UUID = UUID.randomUUID(),
    val fileUuid: UUID = UUID.randomUUID(),
) : Serializable
