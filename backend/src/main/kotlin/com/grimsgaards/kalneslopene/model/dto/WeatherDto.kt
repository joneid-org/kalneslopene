package com.grimsgaards.kalneslopene.model.dto

data class WeatherDto(
    val symbol: String,
    val temperature: Double,
    val windSpeed: Double,
    val precipitation: Double,
)
