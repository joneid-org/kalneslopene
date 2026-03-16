package com.grimsgaards.kalneslopene.model.dto

import java.util.*

data class OrganizerDTO(
    val uuid: UUID,
    val name: String,
    val responsibility: String,
    val initials: String,
    val phone: String,
    val email: String,
)