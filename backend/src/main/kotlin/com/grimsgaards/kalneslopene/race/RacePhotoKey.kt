package com.grimsgaards.kalneslopene.race

import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.UUID

@Embeddable
data class RacePhotoKey(
    val raceUuid: UUID = UUID.randomUUID(),
    val photoUuid: UUID = UUID.randomUUID(),
) : Serializable
