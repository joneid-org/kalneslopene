package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime
import java.util.*

@Repository
interface RaceRepository : JpaRepository<RaceEntity, UUID> {

    fun findAllByRaceDateIsAfter(date: OffsetDateTime): List<RaceEntity>
}