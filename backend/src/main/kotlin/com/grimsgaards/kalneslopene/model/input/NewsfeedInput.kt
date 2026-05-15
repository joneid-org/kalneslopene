package com.grimsgaards.kalneslopene.model.input

import java.time.LocalDateTime
import java.util.*

data class NewsfeedInput(
    val uuid: UUID? = null,
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: LocalDateTime,
    val headerImage: String? = null,
    val images: List<String> = emptyList(),
)

