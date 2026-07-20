package com.grimsgaards.kalneslopene.model.dto

import java.util.UUID

data class RunnerDTO(
    val uuid: UUID,
    val name: String,
    val gender: Gender,
    val isVerified: Boolean,
)

enum class Gender {
    MALE,
    FEMALE,
}
