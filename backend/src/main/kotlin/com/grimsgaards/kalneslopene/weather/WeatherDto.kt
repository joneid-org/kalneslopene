package com.grimsgaards.kalneslopene.weather

data class WeatherDto(
    val symbol: String? = null,
    val temperature: Double? = null,
    val windSpeed: Double? = null,
    val precipitation: Double? = null,
    val windDirection: Double? = null,
)
