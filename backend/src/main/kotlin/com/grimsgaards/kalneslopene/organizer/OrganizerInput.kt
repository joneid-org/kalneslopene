package com.grimsgaards.kalneslopene.organizer

import java.util.UUID

data class OrganizerInput(
    val uuid: UUID? = null,
    val name: String,
    val responsibility: List<String>,
    val initials: String,
    val phone: String? = null,
    val email: String? = null,
    val contactPerson: Boolean,
    val image: String? = null,
)
