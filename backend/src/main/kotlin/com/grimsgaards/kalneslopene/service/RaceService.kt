package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class RaceService(
    val raceRepository: RaceRepository,
    val runnerRepository: RunnerRepository,
    val raceRunnerRepository: RaceRunnerRepository,
) {

    fun getAll(): List<RaceDTO> {
        return raceRepository.findAllSorted().map { it.toDto() }
    }

    fun findByUuid(uuid: UUID): RaceDTO {
        return raceRepository.findByIdOrNull(uuid)?.toDto()
            ?: throw NoSuchElementException("Race with id $uuid not found")
    }

    fun createRaces(races: List<RaceInput>): List<RaceDTO> {
        return raceRepository.saveAll(races.map {
            RaceEntity(
                raceDate = it.raceDate,
                weather = it.weather
            )
        }).map { it.toDto() }
    }

    fun updateRace(updatedRace: RaceInput, uuid: UUID? = null): RaceDTO {
        val resolvedUuid = updatedRace.uuid ?: uuid ?: throw IllegalArgumentException("UUID must be provided")
        val existingRace = raceRepository.findById(resolvedUuid)
            .orElseThrow { NoSuchElementException("Race with uuid $resolvedUuid not found") }

        existingRace.apply {
            raceDate = updatedRace.raceDate
            weather = updatedRace.weather
        }

        return raceRepository.save(existingRace).toDto()

    }

    fun deleteRaceById(uuid: UUID) {
        return raceRepository.deleteById(uuid)
    }

    fun findAllRunnersInRace(uuid: UUID): List<RaceRunnerDTO> {
        val race = raceRepository.findByIdOrNull(uuid)
        return race?.runners?.map { it.toDto() } ?: throw IllegalArgumentException("no race found with id $uuid")
    }

    @Transactional
    fun addRunnersToRace(raceUuid: UUID, runners: List<RaceRunnerDTO>): List<RaceRunnerDTO> {
        val race = raceRepository.findByIdOrNull(raceUuid)
            ?: throw NoSuchElementException("Race $raceUuid not found")

        val savedEntities = runners.map { dto ->
            val runner = runnerRepository.findByIdOrNull(requireNotNull(dto.runner.uuid) { "Runner UUID cannot be null" })
                ?: throw NoSuchElementException("Runner ${dto.runner.uuid} not found")
            val key = RaceRunnerKey(runnerUuid = runner.uuid, raceUuid = race.uuid)

            val existing = raceRunnerRepository.findByIdOrNull(key)
            if (existing != null) {
                existing.resultTime = dto.resultTime
                existing.hideTime = dto.hideTime
                raceRunnerRepository.save(existing)
            } else {
                raceRunnerRepository.save(
                    com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity(
                        id = key,
                        runner = runner,
                        race = race,
                        resultTime = dto.resultTime,
                        hideTime = dto.hideTime
                    )
                )
            }
        }
        raceRunnerRepository.flush()
        return savedEntities.map { it.toDto() }
    }


    fun updateRunnerInRace(raceUuid: UUID, runnerUuid: UUID, runnerDto: RaceRunnerDTO): RaceRunnerDTO {
        val race = raceRepository.findByIdOrNull(raceUuid)
            ?: throw NoSuchElementException("Race $raceUuid not found")
        val runner = runnerRepository.findByIdOrNull(runnerUuid)
            ?: throw NoSuchElementException("Runner $runnerUuid not found")
        val key = RaceRunnerKey(runnerUuid = runner.uuid, raceUuid = race.uuid)
        val entity = race.runners.find { it.id == key }
            ?: throw NoSuchElementException("Runner $runnerUuid not found in race $raceUuid")
        entity.resultTime = runnerDto.resultTime
        entity.hideTime = runnerDto.hideTime
        raceRepository.save(race)
        return entity.toDto()
    }

    fun removeRunnersFromRace(raceUuid: UUID, runners: List<RaceRunnerDTO>) {
        val race = raceRepository.findByIdOrNull(raceUuid)
            ?: throw NoSuchElementException("Race $raceUuid not found")
        val runnerUuids = runners.map { it.runner.uuid }
        race.runners.removeIf { it.runner.uuid in runnerUuids }
        raceRepository.save(race)
    }
}