package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.*

@Entity
@Table(name = "race")
data class RaceEntity(

    var raceDate: OffsetDateTime,
    var weather: String?,

    @OneToMany(mappedBy = "race", cascade = [(CascadeType.ALL)])
    val runners: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): RaceDTO {
        return RaceDTO(uuid, raceDate, weather)
    }
}