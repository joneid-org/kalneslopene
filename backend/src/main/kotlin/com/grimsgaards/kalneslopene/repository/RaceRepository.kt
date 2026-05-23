package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.controller.RaceFilter
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface RaceRepository : JpaRepository<RaceEntity, UUID> {
    @Query("""
        SELECT n FROM RaceEntity n
        WHERE n.raceDate >= COALESCE(:#{#filter.from}, n.raceDate)
          AND n.raceDate <= COALESCE(:#{#filter.to}, n.raceDate)
        ORDER BY n.raceDate DESC
    """)
    fun findAllByFilter(filter: RaceFilter): List<RaceEntity>
}
