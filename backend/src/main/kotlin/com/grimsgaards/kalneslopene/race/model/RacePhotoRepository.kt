package com.grimsgaards.kalneslopene.race.model

import com.grimsgaards.kalneslopene.race.RacePhotoKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RacePhotoRepository : JpaRepository<RacePhotoEntity, RacePhotoKey> {
    fun findAllByRaceUuidOrderByOrderIndexAsc(raceUuid: UUID): List<RacePhotoEntity>
}
