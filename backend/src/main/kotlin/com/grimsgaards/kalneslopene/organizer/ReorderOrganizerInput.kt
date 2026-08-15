package com.grimsgaards.kalneslopene.organizer

import java.util.UUID

data class ReorderOrganizerInput(
    val organizerUuid: UUID,
    val beforeOrganizerUuid: UUID? = null,
    val afterOrganizerUuid: UUID? = null,
) {
    init {
        require((beforeOrganizerUuid == null) != (afterOrganizerUuid == null)) {
            "Exactly one of beforeOrganizerUuid or afterOrganizerUuid must be set"
        }
    }
}
