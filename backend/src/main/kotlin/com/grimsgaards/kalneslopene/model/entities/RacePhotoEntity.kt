package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table

@Entity
@Table(name = "race_photo")
class RacePhotoEntity(
    @EmbeddedId
    val id: RacePhotoKey = RacePhotoKey(),
    @ManyToOne
    @MapsId("raceUuid")
    @JoinColumn(name = "race_uuid")
    val race: RaceEntity,
    @ManyToOne
    @MapsId("fileUuid")
    @JoinColumn(name = "file_uuid")
    val file: FileEntity,
    var orderIndex: Double,
)
