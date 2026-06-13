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

    @OneToMany(mappedBy = "race", fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST], orphanRemoval = true)
    val runners: MutableList<RaceRunnerEntity> = mutableListOf()
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST])
    @JoinTable(
        name = "race_photo",
        joinColumns = [JoinColumn(name = "race_uuid")],
        inverseJoinColumns = [JoinColumn(name = "file_uuid")]
    )
    val photos: MutableSet<FileEntity> = mutableSetOf()

    fun toDto(): RaceDTO {
        return RaceDTO(
            uuid = uuid,
            raceDate = raceDate,
            weather = weather,
            runnerCount = runners.size,
            photos = photos.mapNotNull { it.toDto() }
        )
    }
}