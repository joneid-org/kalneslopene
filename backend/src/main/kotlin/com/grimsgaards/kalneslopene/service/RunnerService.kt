package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.model.input.RunnerInput
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RunnerService(
    val runnerRepository: RunnerRepository,
) {
    fun getAllRunners(): List<RunnerDTO> = runnerRepository.findAll().map { it.toDto() }

    fun getRunnerById(uuid: UUID): RunnerDTO = runnerRepository.findById(uuid).get().toDto()

    fun getRunnerByName(name: String): List<RunnerDTO> = runnerRepository.findByNameContainsIgnoreCase(name).map { it.toDto() }

    fun createMultipleRunners(runners: List<RunnerInput>): List<RunnerDTO> =
        runnerRepository
            .saveAll(
                runners.map {
                    RunnerEntity(
                        name = it.name,
                        gender = Gender.valueOf(it.gender.uppercase()),
                        isVerified = it.isVerified,
                    )
                },
            ).map { it.toDto() }

    fun updateRunner(
        uuid: UUID,
        updatedRunner: RunnerInput,
    ): RunnerDTO {
        val existingRunner =
            runnerRepository
                .findById(uuid)
                .orElseThrow { NoSuchElementException("Runner with uuid $uuid not found") }

        existingRunner.apply {
            name = updatedRunner.name
            gender = Gender.valueOf(updatedRunner.gender.uppercase())
            isVerified = updatedRunner.isVerified
        }
        return runnerRepository.save(existingRunner).toDto()
    }

    fun deleteRunner(uuid: UUID) {
        runnerRepository.deleteById(uuid)
    }

    fun findAllRacesByRunner(uuid: UUID): List<RaceRunnerDTO> {
        val runner = runnerRepository.findByIdOrNull(uuid)
        return runner?.races?.filter { it.race.isPublished }?.map { it.toDto() }
            ?: throw IllegalArgumentException("no runner found with id $uuid")
    }
}
