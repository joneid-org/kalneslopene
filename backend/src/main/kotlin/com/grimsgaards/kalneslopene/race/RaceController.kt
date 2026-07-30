package com.grimsgaards.kalneslopene.race

import com.grimsgaards.kalneslopene.common.PagedResponse
import com.grimsgaards.kalneslopene.common.toPagedResponse
import com.grimsgaards.kalneslopene.race.dto.RaceDTO
import com.grimsgaards.kalneslopene.race.dto.RaceFilter
import com.grimsgaards.kalneslopene.race.dto.RaceInfoDto
import com.grimsgaards.kalneslopene.race.dto.RaceInput
import com.grimsgaards.kalneslopene.race.dto.RaceResultSummaryDto
import com.grimsgaards.kalneslopene.race.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.race.dto.ReorderPhotoInput
import com.grimsgaards.kalneslopene.s3.FileDto
import com.grimsgaards.kalneslopene.s3.PhotoUploadInfo
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

const val RACE_API = "/api/races"

@Suppress("TooManyFunctions")
@RestController
class RaceController(
    val raceService: RaceService,
) {
    @GetMapping(RACE_API)
    fun getRaces(
        filter: RaceFilter,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(required = false) pageSize: Int?,
        @RequestParam(required = false) sortDirection: String?,
    ): PagedResponse<RaceDTO> =
        raceService
            .getAll(
                filter,
                page,
                pageSize,
                sortDirection?.let { Sort.Direction.valueOf(it.trim().uppercase()) } ?: Sort.Direction.DESC,
            ).toPagedResponse()

    @GetMapping("/api/race-info")
    fun getAllRacesInfo(
        @RequestParam(required = false) isPublished: Boolean?,
    ): List<RaceInfoDto> = raceService.getAllInfo(isPublished)

    @GetMapping("/api/race-next")
    fun getNextRace(): ResponseEntity<RaceDTO> =
        raceService.findNextRace()?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.noContent().build()

    @GetMapping("$RACE_API/{uuid}")
    fun getRaceById(
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.findByUuid(uuid)

    @PatchMapping("$RACE_API/{uuid}")
    fun updateRace(
        @RequestBody input: RaceInput,
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.updateRace(uuid, input)

    @DeleteMapping("$RACE_API/{uuid}")
    fun deleteRaceById(
        @PathVariable uuid: UUID,
    ) = raceService.deleteRaceById(uuid)

    @PostMapping(RACE_API)
    fun createRaces(
        @RequestBody races: List<RaceInput>,
    ): List<RaceDTO> = raceService.createRaces(races)

    @PostMapping("$RACE_API/{uuid}/publish")
    fun publishRace(
        @PathVariable uuid: UUID,
    ): RaceDTO = raceService.publishRace(uuid)

    @GetMapping("$RACE_API/{uuid}/runners")
    fun getRunnersInRace(
        @PathVariable uuid: UUID,
    ): List<RaceRunnerDTO> = raceService.findAllRunnersInRace(uuid)

    @GetMapping("$RACE_API/{uuid}/results/summary")
    fun getResultSummary(
        @PathVariable uuid: UUID,
    ): RaceResultSummaryDto = raceService.getResultSummary(uuid)

    @PostMapping("$RACE_API/{uuid}/runners")
    fun addRunnersToRace(
        @PathVariable uuid: UUID,
        @RequestBody runners: List<RaceRunnerDTO>,
    ): List<RaceRunnerDTO> = raceService.addRunnersToRace(uuid, runners)

    @PostMapping("$RACE_API/{uuid}/photos")
    fun addPhotoToRace(
        @PathVariable uuid: UUID,
        @RequestBody photos: List<String>,
    ): Map<String, PhotoUploadInfo> = raceService.addPhotosToRace(uuid, photos)

    @PatchMapping("$RACE_API/{uuid}/photos/order")
    fun reorderPhoto(
        @PathVariable uuid: UUID,
        @RequestBody input: ReorderPhotoInput,
    ): List<FileDto> = raceService.reorderPhotoInRace(uuid, input)

    @PatchMapping("$RACE_API/{uuid}/runners/{runnerUuid}")
    fun updateRunnerInRace(
        @PathVariable uuid: UUID,
        @PathVariable runnerUuid: UUID,
        @RequestBody runner: RaceRunnerDTO,
    ): RaceRunnerDTO = raceService.updateRunnerInRace(uuid, runnerUuid, runner)

    @DeleteMapping("$RACE_API/{uuid}/runners")
    fun removeRunnersFromRace(
        @PathVariable uuid: UUID,
        @RequestBody runnerUuids: List<UUID>,
    ) = raceService.removeRunnersFromRace(uuid, runnerUuids.toSet())
}
