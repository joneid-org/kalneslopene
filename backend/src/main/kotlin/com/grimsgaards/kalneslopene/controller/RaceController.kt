package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.service.RaceService
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.*

@RestController
@RequestMapping("/api/races")
class RaceController(
    val raceService: RaceService,
) {

    @GetMapping
    fun getAllRaces(filter: RaceFilter): List<RaceDTO> = raceService.getAll(filter)

    @GetMapping("/{uuid}")
    fun getRaceById(@PathVariable uuid: UUID): RaceDTO = raceService.findByUuid(uuid)

    @PatchMapping("/{uuid}")
    fun updateRace(@RequestBody input: RaceInput, @PathVariable uuid: UUID): RaceDTO = raceService.updateRace(uuid, input)

    @DeleteMapping("/{uuid}")
    fun deleteRaceById(@PathVariable uuid: UUID) = raceService.deleteRaceById(uuid)

    @PostMapping()
    fun createRaces(@RequestBody races: List<RaceInput>): List<RaceDTO> = raceService.createRaces(races)

    @GetMapping("/{uuid}/runners")
    fun getRunnersInRace(@PathVariable uuid: UUID): List<RaceRunnerDTO> = raceService.findAllRunnersInRace(uuid)

    @PostMapping("/{uuid}/runners")
    fun addRunnersToRace(@PathVariable uuid: UUID, @RequestBody runners: List<RaceRunnerDTO>): List<RaceRunnerDTO> =
        raceService.addRunnersToRace(uuid, runners)

    @PatchMapping("/{uuid}/runners/{runnerUuid}")
    fun updateRunnerInRace(
        @PathVariable uuid: UUID,
        @PathVariable runnerUuid: UUID,
        @RequestBody runner: RaceRunnerDTO
    ): RaceRunnerDTO = raceService.updateRunnerInRace(uuid, runnerUuid, runner)

    @DeleteMapping("/{uuid}/runners")
    fun removeRunnersFromRace(@PathVariable uuid: UUID, @RequestBody runnerUuids: List<UUID>) =
        raceService.removeRunnersFromRace(uuid, runnerUuids.toSet())
}

data class RaceFilter(
    val from: LocalDateTime? = null,
    val to: LocalDateTime? = null,
)