package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Duration
import java.util.*

@Entity
@Table(name = "runner")
data class RunnerEntity(

    var name: String,

    @Enumerated(EnumType.STRING)
    var gender: Gender,

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    var pr: Duration? = null,

    @OneToMany(mappedBy = "runner")
    val races: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): RunnerDTO {
        return RunnerDTO(uuid, name, gender, pr)
    }
}
