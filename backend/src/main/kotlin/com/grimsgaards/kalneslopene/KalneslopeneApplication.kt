package com.grimsgaards.kalneslopene

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.TimeZone

@SpringBootApplication
class KalneslopeneApplication

fun main(args: Array<String>) {
    TimeZone.setDefault(TimeZone.getTimeZone("Europe/Oslo"))
    runApplication<KalneslopeneApplication>(*args)
}
