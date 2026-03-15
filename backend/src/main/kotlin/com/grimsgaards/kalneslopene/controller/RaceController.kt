package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.service.RaceService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/races")
class RaceController(
    val raceService: RaceService
) {

    @GetMapping("/upcomingRaces")
    fun getUpcomingRaces(): List<RaceDTO> {
        return raceService.getUpcomingRaces()
    }
}