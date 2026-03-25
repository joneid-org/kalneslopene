package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RacePatchDTO
import com.grimsgaards.kalneslopene.service.RaceService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/races")
class RaceController(
    val raceService: RaceService
) {

    @GetMapping("")
    fun getAllRaces(): List<RaceDTO> {
        return raceService.getAll()
    }

    @GetMapping("/{uuid}")
    fun getRaceById(@PathVariable uuid: UUID): RaceDTO {
        return raceService.findByUuid(uuid)
    }

    @PatchMapping("/{uuid}")
    fun updateRaceById(@PathVariable uuid: UUID, @RequestBody patch: RacePatchDTO): RaceDTO {
        return raceService.updateRaceById(uuid, patch)
    }

    @DeleteMapping("/{uuid}")
    fun deleteRaceById(@PathVariable uuid: UUID) {
    return raceService.deleteRaceById(uuid)
    }

    @PostMapping("/createRaces")
    fun createRaces(@RequestBody races: List<RaceDTO>): List<RaceDTO> {
        return raceService.createRaces(races)
    }

}