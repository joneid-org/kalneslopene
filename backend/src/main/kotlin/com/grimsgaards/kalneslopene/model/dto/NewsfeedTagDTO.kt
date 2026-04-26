package com.grimsgaards.kalneslopene.model.dto

import java.util.UUID

data class NewsfeedTagDTO(
    val uuid: UUID?,
    val label: String,
    val value: String,
    val color: String,
)

