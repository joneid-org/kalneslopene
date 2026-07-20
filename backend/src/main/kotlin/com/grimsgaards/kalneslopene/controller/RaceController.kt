package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceResultSummaryDto
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.service.RaceService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@Suppress("TooManyFunctions")
@RestController
@RequestMapping("/api/races")
class RaceController(
    val raceService: RaceService,
) {
    @GetMapping
    fun getAllRaces(filter: RaceFilter): List<RaceDTO> = raceService.getAll(filter)

    @GetMapping("/{uuid}")
    fun getRaceById(
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.findByUuid(uuid)

    @PatchMapping("/{uuid}")
    fun updateRace(
        @RequestBody input: RaceInput,
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.updateRace(uuid, input)

    @DeleteMapping("/{uuid}")
    fun deleteRaceById(
        @PathVariable uuid: UUID,
    ) = raceService.deleteRaceById(uuid)

    @PostMapping()
    fun createRaces(
        @RequestBody races: List<RaceInput>,
    ): List<RaceDTO> = raceService.createRaces(races)

    @PostMapping("/{uuid}/publish")
    fun publishRace(
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.publishRace(uuid)

    @GetMapping("/{uuid}/runners")
    fun getRunnersInRace(
        @PathVariable uuid: UUID,
    ): List<RaceRunnerDTO> = raceService.findAllRunnersInRace(uuid)

    @GetMapping("/{uuid}/results/summary")
    fun getResultSummary(
        @PathVariable uuid: UUID,
    ): RaceResultSummaryDto = raceService.getResultSummary(uuid)

    @PostMapping("/{uuid}/runners")
    fun addRunnersToRace(
        @PathVariable uuid: UUID,
        @RequestBody runners: List<RaceRunnerDTO>,
    ): List<RaceRunnerDTO> = raceService.addRunnersToRace(uuid, runners)

    @PostMapping("/{uuid}/photos")
    fun addPhotoToRace(
        @PathVariable uuid: UUID,
        @RequestBody photos: List<String>,
    ): Map<String, PhotoUploadInfo> = raceService.addPhotosToRace(uuid, photos)

    @PatchMapping("/{uuid}/runners/{runnerUuid}")
    fun updateRunnerInRace(
        @PathVariable uuid: UUID,
        @PathVariable runnerUuid: UUID,
        @RequestBody runner: RaceRunnerDTO,
    ): RaceRunnerDTO = raceService.updateRunnerInRace(uuid, runnerUuid, runner)

    @DeleteMapping("/{uuid}/runners")
    fun removeRunnersFromRace(
        @PathVariable uuid: UUID,
        @RequestBody runnerUuids: List<UUID>,
    ) = raceService.removeRunnersFromRace(uuid, runnerUuids.toSet())
}
