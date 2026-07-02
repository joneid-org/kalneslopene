package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Duration

@Entity
@Immutable
@Table(name = "race_runner_stats")
data class RaceRunnerStatsEntity(
    @EmbeddedId
    val id: RaceRunnerKey = RaceRunnerKey(),
    val totalRaces: Int = 0,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val personalBest: Duration? = null,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val seasonBest: Duration? = null,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val previousBest: Duration? = null,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    val previousSeasonBest: Duration? = null,
) {
    fun beatsPreviousBest(time: Duration): Boolean = previousBest == null || time < previousBest

    fun beatsPreviousSeasonBest(time: Duration): Boolean = previousSeasonBest == null || time < previousSeasonBest
}
