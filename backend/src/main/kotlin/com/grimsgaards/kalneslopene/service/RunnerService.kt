package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class RunnerService(
    val runnerRepository: RunnerRepository,
) {
    fun getAllRunners(): List<RunnerDTO> {
        return runnerRepository.findAll().map { it.toDto() }
    }

    fun getRunnerById(uuid: UUID): RunnerDTO {
        return runnerRepository.findById(uuid).get().toDto()
    }

    fun getRunnerByName(name: String): List<RunnerDTO> {
        return runnerRepository.findByNameStartsWithIgnoreCase(name).map { it.toDto() }
    }

    fun createMultipleRunners(runners: List<RunnerDTO>): List<RunnerDTO> {
        return runnerRepository.saveAll(runners.map {
            RunnerEntity(
                name = it.name,
                gender = it.gender,
                pr = it.pr
            )
        }).map { it.toDto() }
    }

    fun updateRunner(updatedRunner: RunnerDTO, uuid: UUID): RunnerDTO {
        val existingRunner = runnerRepository.findById(uuid)
        .orElseThrow { NoSuchElementException("Runner with uuid $uuid not found") }

        existingRunner.apply {
            name = updatedRunner.name
            gender = updatedRunner.gender
            pr = updatedRunner.pr
        }
        return runnerRepository.save(existingRunner).toDto()
    }

    fun deleteRunner(uuid: UUID) {
        runnerRepository.deleteById(uuid)
    }

    fun findAllRacesByRunner(uuid: UUID): List<RaceRunnerDTO> {
        val runner = runnerRepository.findByIdOrNull(uuid)
        return runner?.races?.map { it.toDto() } ?: throw IllegalArgumentException("no runner found with id $uuid")
    }
}