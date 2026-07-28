package com.grimsgaards.kalneslopene.model.input

import java.time.LocalDateTime

data class RaceFilter(
    val from: LocalDateTime? = null,
    val to: LocalDateTime? = null,
    val isPublished: Boolean? = null,
) {
    fun spansSingleYear(): Boolean = from != null && to != null && from.year == to.year
}
