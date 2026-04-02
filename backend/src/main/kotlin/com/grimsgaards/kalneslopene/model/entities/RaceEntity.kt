package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "race")
data class RaceEntity(
    @Column(name = "race_date", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    var raceDate: LocalDateTime,
    var weather: String?,

    @OneToMany(mappedBy = "race", cascade = [(CascadeType.ALL)], orphanRemoval = true)
    val runners: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): RaceDTO {
        return RaceDTO(uuid, raceDate, weather)
    }
}