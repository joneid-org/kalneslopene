package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.PrimaryKeyJoinColumn
import jakarta.persistence.SecondaryTable
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.annotations.SecondaryRow
import org.hibernate.type.SqlTypes
import java.time.Duration
import java.util.UUID

@Entity
@Table(name = "runner")
@SecondaryTable(
    name = "runner_stats",
    pkJoinColumns = [PrimaryKeyJoinColumn(name = "runner_uuid", referencedColumnName = "uuid")],
)
@SecondaryRow(table = "runner_stats", optional = true)
class RunnerEntity(
    var name: String,
    @Enumerated(EnumType.STRING)
    var gender: Gender,
    var isVerified: Boolean = false,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "historic_personal_record")
    var historicPersonalRecord: Duration? = null,
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "historic_season_record")
    var historicSeasonRecord: Duration? = null,
    @OneToMany(mappedBy = "runner")
    val races: MutableList<RaceRunnerEntity> = mutableListOf(),
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "personal_record", table = "runner_stats", insertable = false, updatable = false)
    val personalRecord: Duration? = null

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "season_record", table = "runner_stats", insertable = false, updatable = false)
    val seasonBest: Duration? = null

    @Column(name = "total_races", table = "runner_stats", insertable = false, updatable = false)
    val totalRaces: Int? = null

    @Column(name = "season_races", table = "runner_stats", insertable = false, updatable = false)
    val seasonRaces: Int? = null

    fun toDto(): RunnerDTO = RunnerDTO(uuid, name, gender, isVerified)
}
