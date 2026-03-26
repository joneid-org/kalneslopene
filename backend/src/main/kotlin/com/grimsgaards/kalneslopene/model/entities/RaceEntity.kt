package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalTime
import java.util.*

@Entity
@Table(name = "race")
data class RaceEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val raceDate: LocalDate,
    val raceTime: LocalTime,
    val weather: String?,

    @OneToMany(mappedBy = "race", cascade = [(CascadeType.ALL)])
    val runners: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    fun toDto(): RaceDTO {
        return RaceDTO(uuid, raceDate, raceTime, weather)
    }
}