package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.*

@Repository
interface RaceRepository : JpaRepository<RaceEntity, UUID> {

    fun findAllByRaceDateIsAfter(date: LocalDate): List<RaceEntity>
    fun findAllByRaceDateIsLessThanEqual(date: LocalDate): List<RaceEntity>
    fun findByUuid(uuid: UUID): RaceEntity
    }