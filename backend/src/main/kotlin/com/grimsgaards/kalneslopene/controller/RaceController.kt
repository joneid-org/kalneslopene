package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.service.RaceService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/races")
class RaceController(
    val raceService: RaceService
) {

    @GetMapping("/upcomingRaces")
    fun getUpcomingRaces(): List<RaceDTO> {
        return raceService.getUpcomingRaces()
    }

    @GetMapping("/previousRaces")
    fun getPreviousRaces(): List<RaceDTO> {
        return raceService.getPreviousRaces()
    }

    @GetMapping("/allRaces")
    fun getAllRaces(): List<RaceDTO> {
        return raceService.getAll()
    }

    @GetMapping("/{id}")
    fun getRaceById(@PathVariable id: UUID): RaceDTO {
        return raceService.findByUuid(id)
    }
}