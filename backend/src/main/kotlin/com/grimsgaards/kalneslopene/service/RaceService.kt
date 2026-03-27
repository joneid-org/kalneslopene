package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class RaceService(
    val raceRepository: RaceRepository,
) {

    fun getAll(): List<RaceDTO> {
        return raceRepository.findAllSorted().map { it.toDto() }
    }

    fun findByUuid(uuid: UUID): RaceDTO {
        return raceRepository.findByIdOrNull(uuid)?.toDto()
            ?: throw NoSuchElementException("Race with id $uuid not found")
    }

    fun createRaces(races: List<RaceDTO>): List<RaceDTO> {
        return raceRepository.saveAll(races.map {
            RaceEntity(
                raceDate = it.raceDate,
                raceTime = it.raceTime,
                weather = it.weather
            )
        }).map { it.toDto() }
    }

    fun updateRace(updatedRace: RaceDTO, uuid: UUID): RaceDTO {

        val existingRace = raceRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Race with uuid $uuid not found") }

        existingRace.apply {
            raceDate = updatedRace.raceDate
            raceTime = updatedRace.raceTime
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

}