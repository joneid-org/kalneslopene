package com.grimsgaards.kalneslopene.race.dto

import java.util.UUID

data class ReorderPhotoInput(
    val fileUuid: UUID,
    val beforeFileUuid: UUID? = null,
    val afterFileUuid: UUID? = null,
) {
    init {
        require((beforeFileUuid == null) != (afterFileUuid == null)) {
            "Exactly one of beforeFileUuid or afterFileUuid must be set"
        }
    }
}
