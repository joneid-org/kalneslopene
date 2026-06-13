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
import org.hibernate.type.SqlTypes
import java.time.Duration
import java.util.*

@Entity
@Table(name = "runner")
@SecondaryTable(
    name = "personal_records",
    pkJoinColumns = [PrimaryKeyJoinColumn(name = "runner_uuid", referencedColumnName = "uuid")],
)
data class RunnerEntity(
    var name: String,
    @Enumerated(EnumType.STRING)
    var gender: Gender,
    @OneToMany(mappedBy = "runner")
    val races: MutableList<RaceRunnerEntity> = mutableListOf(),
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "record", table = "personal_records", insertable = false, updatable = false)
    val personalRecord: Duration? = null

    fun toDto(): RunnerDTO = RunnerDTO(uuid, name, gender)
}
