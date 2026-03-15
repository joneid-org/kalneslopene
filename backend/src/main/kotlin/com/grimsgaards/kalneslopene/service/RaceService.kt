package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.repository.RaceRepository
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
class RaceService(
    val raceRepository: RaceRepository
) {
    fun getUpcomingRaces(): List<RaceDTO> {
        return raceRepository.findAllByRaceDateIsAfter(OffsetDateTime.now()).map { it.toDto() }
    }
}