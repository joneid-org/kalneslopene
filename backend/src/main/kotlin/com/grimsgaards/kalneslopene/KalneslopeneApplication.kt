package com.grimsgaards.kalneslopene

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class KalneslopeneApplication

fun main(args: Array<String>) {
    runApplication<KalneslopeneApplication>(*args)
}
