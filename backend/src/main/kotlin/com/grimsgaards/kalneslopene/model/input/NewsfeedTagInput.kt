package com.grimsgaards.kalneslopene.model.input

data class NewsfeedTagInput(
    val value: String,
    val color: String,
)

data class NewsfeedTagUpdateInput(
    val color: String,
)