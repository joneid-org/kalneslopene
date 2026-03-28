package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Duration

@Entity
@Table(name = "race_runner")
data class RaceRunnerEntity(

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
    val resultTime: Duration,
    val hideTime: Boolean = false,
) {
    fun toDto(): RaceRunnerDTO {
        return RaceRunnerDTO(
            runner = runner.toDto(),
            race = race.toDto(),
            resultTime = resultTime,
            hideTime = hideTime
        )
    }
}
