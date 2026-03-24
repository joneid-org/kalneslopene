package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
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
    val weather: String?
) {
    fun toDto(): RaceDTO {
        return RaceDTO(uuid, raceDate, raceTime, weather)
    }
}