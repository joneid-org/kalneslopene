package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.service.RunnerService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/runners")
class RunnerController(
    val runnerService: RunnerService
) {

    @GetMapping
    fun getRunnerByName(@RequestParam name: String?): List<RunnerDTO> {
        return if (name != null) {
            runnerService.getRunnerByName(name)
        } else {
            runnerService.getAllRunners()
        }
    }

    @GetMapping("/{uuid}")
    fun getRunnerByUuid(@PathVariable uuid: UUID): RunnerDTO {
        return runnerService.getRunnerById(uuid)
    }

    @PatchMapping("/{uuid}")
    fun updateRunner(@RequestBody runner: RunnerDTO, @PathVariable uuid: UUID): RunnerDTO {
        return runnerService.updateRunner(runner, uuid)
    }

    @PostMapping
    fun createMultipleRunners(@RequestBody runners: List<RunnerDTO>): List<RunnerDTO> {
        return runnerService.createMultipleRunners(runners)
    }

    @DeleteMapping("/{uuid}")
    fun deleteRunner(@PathVariable uuid: UUID) {
        runnerService.deleteRunner(uuid)
    }

    @GetMapping("/{uuid}/races")
    fun getAllRacesByRunner(@PathVariable uuid: UUID): List<RaceRunnerDTO> {
        return runnerService.findAllRacesByRunner(uuid)
    }

}