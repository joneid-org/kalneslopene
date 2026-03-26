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
        return raceRepository.findAll().sortedByDescending { it.raceDate }.map { it.toDto() }
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

    fun updateRace(race: RaceDTO): RaceDTO {
        if (race.uuid === null) throw IllegalArgumentException("uuid is required for update")

        return raceRepository.save(
            RaceEntity(
                uuid = race.uuid,
                raceDate = race.raceDate,
                raceTime = race.raceTime,
                weather = race.weather
            )
        ).toDto()
    }

    fun deleteRaceById(uuid: UUID) {
        return raceRepository.deleteById(uuid)
    }

    fun findAllRunnersInRace(uuid: UUID): List<RaceRunnerDTO> {
        val race = raceRepository.findByIdOrNull(uuid)
        return race?.runners?.map { it.toDto() } ?: throw IllegalArgumentException("no race found with id $uuid")
    }

}