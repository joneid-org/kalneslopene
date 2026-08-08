package com.grimsgaards.kalneslopene.race.model

import com.grimsgaards.kalneslopene.race.RaceRunnerKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.Duration
import java.time.LocalDateTime
import java.util.UUID

interface RunnerRaceCount {
    val runnerUuid: UUID
    val raceCount: Long
}

interface RaceRunnerHistory {
    val runnerUuid: UUID
    val raceDate: LocalDateTime
    val resultTime: Duration?
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

    @Query(
        """
        SELECT rr.runner.uuid AS runnerUuid, rr.race.raceDate AS raceDate, rr.resultTime AS resultTime
        FROM RaceRunnerEntity rr
        WHERE rr.race.uuid NOT IN :excludedRaceUuids
          AND rr.race.isPublished = true
        """,
    )
    fun findHistoryOutsideRaces(
        @Param("excludedRaceUuids") excludedRaceUuids: Collection<UUID>,
    ): List<RaceRunnerHistory>

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM RaceRunnerEntity rr WHERE rr.race.uuid IN :raceUuids")
    fun deleteByRaceUuidIn(
        @Param("raceUuids") raceUuids: Collection<UUID>,
    ): Int
}
