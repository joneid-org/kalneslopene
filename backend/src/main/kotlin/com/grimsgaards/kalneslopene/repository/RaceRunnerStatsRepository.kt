package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerStatsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RaceRunnerStatsRepository : JpaRepository<RaceRunnerStatsEntity, RaceRunnerKey> {
    fun findAllByIdRaceUuid(raceUuid: UUID): List<RaceRunnerStatsEntity>
}
