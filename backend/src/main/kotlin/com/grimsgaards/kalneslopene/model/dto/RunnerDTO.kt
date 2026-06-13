package com.grimsgaards.kalneslopene.model.dto

import java.util.UUID

data class RunnerDTO(
    val uuid: UUID,
    val name: String,
    val gender: Gender,
)

enum class Gender {
    MALE,
    FEMALE,
}
