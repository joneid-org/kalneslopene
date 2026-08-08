package com.grimsgaards.kalneslopene.runner

import com.grimsgaards.kalneslopene.race.dto.RaceRunnerDTO
import jakarta.transaction.Transactional
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
class RunnerService(
    val runnerRepository: RunnerRepository,
) {
    fun getRunners(
        name: String?,
        isVerified: Boolean?,
    ): List<RunnerDTO> {
        val runners =
            when {
                name != null && isVerified != null -> runnerRepository.findByNameContainsIgnoreCaseAndIsVerified(name, isVerified)
                name != null -> runnerRepository.findByNameContainsIgnoreCase(name)
                isVerified != null -> runnerRepository.findByIsVerified(isVerified)
                else -> runnerRepository.findAll()
            }
        return runners.map { it.toDto() }
    }

    fun getRunnerById(uuid: UUID): RunnerDTO = runnerRepository.findById(uuid).get().toDto()

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

    @Transactional
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
        return existingRunner.toDto()
    }

    @Transactional
    fun deleteRunner(uuid: UUID) {
        try {
            runnerRepository.deleteByUuid(uuid)
        } catch (e: DataIntegrityViolationException) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Løper er med i løp og kan ikke slettes", e)
        }
    }

    fun findAllRacesByRunner(uuid: UUID): List<RaceRunnerDTO> {
        val runner = runnerRepository.findByIdOrNull(uuid)
        return runner?.races?.filter { it.race.isPublished }?.map { it.toDto() }
            ?: throw IllegalArgumentException("no runner found with id $uuid")
    }
}
