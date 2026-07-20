package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RaceRepository : JpaRepository<RaceEntity, UUID> {
    @Query(
        """
        SELECT n FROM RaceEntity n
        WHERE n.raceDate >= COALESCE(:#{#filter.from}, n.raceDate)
          AND n.raceDate <= COALESCE(:#{#filter.to}, n.raceDate)
          AND n.isPublished = COALESCE(:#{#filter.isPublished}, n.isPublished)
        ORDER BY n.raceDate DESC
    """,
    )
    fun findAllByFilter(filter: RaceFilter): List<RaceEntity>
}
