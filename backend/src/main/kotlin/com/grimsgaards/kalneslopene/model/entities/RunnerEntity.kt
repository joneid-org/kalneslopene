package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RunnerDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "runner")
data class RunnerEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val name: String,
    val gender: String,

    @OneToMany(mappedBy = "runner")
    val races: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    fun toDto(): RunnerDTO {
        return RunnerDTO(uuid, name, gender)
    }
}
