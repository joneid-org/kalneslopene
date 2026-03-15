package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.*

@Entity
@Table(name = "race")
data class RaceEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val raceDate: OffsetDateTime,
    val weather: String?
) {
    fun toDto(): RaceDTO {
        return RaceDTO(uuid, raceDate, weather)
    }
}