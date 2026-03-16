package com.grimsgaards.kalneslopene.model.dto

import java.time.OffsetDateTime
import java.util.*

data class NewsFeedDTO(
    val uuid: UUID,
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: OffsetDateTime,
)