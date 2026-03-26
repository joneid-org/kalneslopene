package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class RunnerService(
    val runnerRepository: RunnerRepository
) {
    fun getAllRunners(): List<RunnerDTO> {
        return runnerRepository.findAll().map { it.toDto() }
    }

    fun getRunnerById(id: UUID): RunnerDTO {
        return runnerRepository.findByUuid(id).toDto()
    }

    fun getRunnerByName(name: String): List<RunnerDTO> {
        return runnerRepository.findByNameStartsWith(name).map { it.toDto() }
    }

    fun createRunner(runner: RunnerDTO): RunnerDTO {
        return runnerRepository.save(
            RunnerEntity(
                name = runner.name,
                gender = runner.gender
            )
        ).toDto()
    }

    fun createMultipleRunners(runners: List<RunnerDTO>): List<RunnerDTO> {
        return runnerRepository.saveAll(runners.map {
            RunnerEntity(
                name = it.name,
                gender = it.gender
            )
        }).map { it.toDto() }
    }

    fun updateRunner(runner: RunnerDTO): RunnerDTO {
        if (runner.uuid === null) throw IllegalArgumentException("uuid is required for update")

        return runnerRepository.save(
            RunnerEntity(
                uuid = runner.uuid,
                name = runner.name,
                gender = runner.gender
            )
        ).toDto()
    }

    fun deleteRunner(uuid: UUID) {
        runnerRepository.deleteById(uuid)
    }
}