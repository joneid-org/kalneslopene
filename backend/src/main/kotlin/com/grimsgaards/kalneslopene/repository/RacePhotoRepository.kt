package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RacePhotoEntity
import com.grimsgaards.kalneslopene.model.entities.RacePhotoKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RacePhotoRepository : JpaRepository<RacePhotoEntity, RacePhotoKey> {
    fun findAllByRaceUuidOrderByOrderIndexAsc(raceUuid: UUID): List<RacePhotoEntity>
}
