package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.model.input.RunnerInput
import com.grimsgaards.kalneslopene.service.RunnerService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/runners")
class RunnerController(
    val runnerService: RunnerService,
) {
    @GetMapping
    fun getRunnerByName(
        @RequestParam name: String?,
    ): List<RunnerDTO> =
        if (name != null) {
            runnerService.getRunnerByName(name)
        } else {
            runnerService.getAllRunners()
        }

    @GetMapping("/{uuid}")
    fun getRunnerByUuid(
        @PathVariable uuid: UUID,
    ): RunnerDTO = runnerService.getRunnerById(uuid)

    @PatchMapping("/{uuid}")
    fun updateRunner(
        @RequestBody input: RunnerInput,
        @PathVariable uuid: UUID,
    ): RunnerDTO = runnerService.updateRunner(uuid, input)

    @PostMapping
    fun createMultipleRunners(
        @RequestBody runners: List<RunnerInput>,
    ): List<RunnerDTO> = runnerService.createMultipleRunners(runners)

    @DeleteMapping("/{uuid}")
    fun deleteRunner(
        @PathVariable uuid: UUID,
    ) {
        runnerService.deleteRunner(uuid)
    }

    @GetMapping("/{uuid}/races")
    fun getAllRacesByRunner(
        @PathVariable uuid: UUID,
    ): List<RaceRunnerDTO> = runnerService.findAllRacesByRunner(uuid)
}
