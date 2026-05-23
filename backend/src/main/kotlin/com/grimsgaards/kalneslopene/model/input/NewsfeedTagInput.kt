package com.grimsgaards.kalneslopene.model.input

data class NewsfeedTagInput(
    val label: String,
    val value: String,
    val color: String,
)

data class NewsfeedTagUpdateInput(
    val label: String,
    val color: String,
)