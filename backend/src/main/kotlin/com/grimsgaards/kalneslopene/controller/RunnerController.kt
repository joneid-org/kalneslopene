package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.service.RunnerService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/runner")
class RunnerController(
    val runnerService: RunnerService
) {

    @GetMapping
    fun getAllRunners(): List<RunnerDTO> {
        return runnerService.getAllRunners()
    }

    @GetMapping("/name/{name}")
    fun getRunnerByName(@PathVariable name: String): List<RunnerDTO> {
        return runnerService.getRunnerByName(name)
    }

    @GetMapping("/{uuid}")
    fun getRunnerByUuid(@PathVariable uuid: UUID): RunnerDTO {
        return runnerService.getRunnerById(uuid)
    }

    @PatchMapping("")
    fun updateRunner(@RequestBody runner: RunnerDTO): RunnerDTO {
        return runnerService.updateRunner(runner)
    }

    @PostMapping("")
    fun createRunner(@RequestBody runner: RunnerDTO): RunnerDTO {
        return runnerService.createRunner(runner)
    }

    @PostMapping("/createMultipleRunners")
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