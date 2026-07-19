package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

interface RunnerRaceCount {
    val runnerUuid: UUID
    val raceCount: Long
}

@Repository
interface RaceRunnerRepository : JpaRepository<RaceRunnerEntity, RaceRunnerKey> {
    @Query(
        """
        SELECT rr.runner.uuid AS runnerUuid, COUNT(rr) AS raceCount
        FROM RaceRunnerEntity rr
        WHERE rr.runner.uuid IN :runnerUuids
          AND rr.race.raceDate >= :seasonStart
          AND rr.race.raceDate <= :raceDate
        GROUP BY rr.runner.uuid
        """,
    )
    fun countRacesPerRunnerInSeason(
        @Param("runnerUuids") runnerUuids: Collection<UUID>,
        @Param("seasonStart") seasonStart: LocalDateTime,
        @Param("raceDate") raceDate: LocalDateTime,
    ): List<RunnerRaceCount>
}
