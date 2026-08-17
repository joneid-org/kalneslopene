package com.grimsgaards.kalneslopene.race.dto

import java.time.LocalDateTime

data class RaceFilter(
    val from: LocalDateTime? = null,
    val to: LocalDateTime? = null,
    val isPublished: Boolean? = null,
    val containsPictures: Boolean? = null,
) {
    fun spansSingleYear(): Boolean = from != null && to != null && from.year == to.year
}
