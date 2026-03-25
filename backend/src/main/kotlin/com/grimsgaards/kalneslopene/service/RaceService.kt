package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RacePatchDTO
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class RaceService(
    val raceRepository: RaceRepository
) {

    fun getAll(): List<RaceDTO> {
        return raceRepository.findAll().sortedByDescending { it.raceDate }.map { it.toDto() }
    }

    fun findByUuid(uuid: UUID): RaceDTO {
        return raceRepository.findByUuid(uuid).toDto()
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

    fun updateRaceById(uuid: UUID, patch: RacePatchDTO): RaceDTO {
        val existingRace = raceRepository.findByIdOrNull(uuid)
            ?: throw NoSuchElementException("Race with id $uuid not found")

        val updatedRace = existingRace.copy(
            raceDate = patch.raceDate ?: existingRace.raceDate,
            raceTime = patch.raceTime ?: existingRace.raceTime,
            weather = patch.weather ?: existingRace.weather
        )

        return raceRepository.save(updatedRace).toDto()
    }

    fun deleteRaceById(uuid: UUID) {
        return raceRepository.deleteById(uuid)
    }


}