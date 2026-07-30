package com.grimsgaards.kalneslopene.runner

import java.time.Duration
import java.util.UUID

data class RunnerDTO(
    val uuid: UUID,
    val name: String,
    val gender: Gender,
    val isVerified: Boolean,
    val historicPersonalRecord: Duration?,
)

enum class Gender {
    MALE,
    FEMALE,
}
