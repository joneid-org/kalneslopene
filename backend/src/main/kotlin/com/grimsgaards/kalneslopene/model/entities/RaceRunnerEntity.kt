package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Duration

@Entity
@Table(name = "race_runner")
class RaceRunnerEntity(
    @EmbeddedId
    val id: RaceRunnerKey = RaceRunnerKey(),
    @ManyToOne
    @MapsId("runnerUuid")
    @JoinColumn(name = "runner_uuid")
    val runner: RunnerEntity,
    @ManyToOne
    @MapsId("raceUuid")
    @JoinColumn(name = "race_uuid")
    val race: RaceEntity,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    var resultTime: Duration?,
    var hideTime: Boolean = false,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val previousPersonalRecord: Duration? = runner.personalRecord,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val previousSeasonRecord: Duration? = runner.seasonBest,
    val totalRaces: Int? = runner.totalRaces,
    val seasonRaces: Int? = runner.seasonRaces,
) {
    fun toDto(): RaceRunnerDTO =
        RaceRunnerDTO(
            runner = runner.toDto(),
            raceUuid = race.uuid,
            resultTime = resultTime,
            hideTime = hideTime,
            previousPersonalRecord = previousPersonalRecord,
            previousSeasonBest = previousSeasonRecord,
            totalRaces = totalRaces ?: 0,
            seasonRaces = seasonRaces ?: 0,
        )
}
