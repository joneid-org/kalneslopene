package com.grimsgaards.kalneslopene.model.dto

import java.time.Duration
import java.util.*

data class RunnerDTO(
    val uuid: UUID,
    val name: String,
    val gender: Gender,
    val pr: Duration? = null
)

enum class Gender {
    MALE,
    FEMALE,
}