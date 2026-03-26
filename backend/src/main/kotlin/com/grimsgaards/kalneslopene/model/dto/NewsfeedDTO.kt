package com.grimsgaards.kalneslopene.model.dto

import java.time.LocalDateTime
import java.util.*

data class NewsfeedDTO(
    val uuid: UUID? = null,
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: LocalDateTime,
)
