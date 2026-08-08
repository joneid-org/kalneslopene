package com.grimsgaards.kalneslopene.newsfeed.dto

data class NewsfeedTagInput(
    val value: String,
    val color: String,
)

data class NewsfeedTagUpdateInput(
    val color: String,
)
