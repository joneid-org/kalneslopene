package com.grimsgaards.kalneslopene.race.dto

import java.util.UUID

data class ReorderPhotoInput(
    val photoUuid: UUID,
    val beforePhotoUuid: UUID? = null,
    val afterPhotoUuid: UUID? = null,
) {
    init {
        require((beforePhotoUuid == null) != (afterPhotoUuid == null)) {
            "Exactly one of beforePhotoUuid or afterPhotoUuid must be set"
        }
    }
}
