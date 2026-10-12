package com.grimsgaards.kalneslopene.race.model

import com.grimsgaards.kalneslopene.race.RacePhotoKey
import com.grimsgaards.kalneslopene.s3.PhotoEntity
import jakarta.persistence.CascadeType
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
    @ManyToOne(cascade = [CascadeType.PERSIST])
    @MapsId("photoUuid")
    @JoinColumn(name = "photo_uuid")
    val photo: PhotoEntity,
    var orderIndex: Double,
)
