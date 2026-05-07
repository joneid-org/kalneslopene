package com.grimsgaards.kalneslopene.model.input

import java.time.OffsetDateTime
import java.util.UUID

data class NewsfeedInput(
    val uuid: UUID? = null,
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: OffsetDateTime,
    val headerImage: String? = null,
    val images: List<String> = emptyList(),
)

