package com.grimsgaards.kalneslopene.race.model

import com.grimsgaards.kalneslopene.race.dto.RaceFilter
import com.grimsgaards.kalneslopene.race.dto.RaceInfoDto
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface RaceRepository : JpaRepository<RaceEntity, UUID> {
    @Query(
        """
        SELECT new com.grimsgaards.kalneslopene.race.dto.RaceInfoDto(n.uuid, n.raceDate) FROM RaceEntity n
        WHERE n.raceDate >= COALESCE(:#{#filter.from}, n.raceDate)
          AND n.raceDate <= COALESCE(:#{#filter.to}, n.raceDate)
          AND n.isPublished = COALESCE(:#{#filter.isPublished}, n.isPublished)
          AND (
            :#{#filter.containsPictures} IS NULL
            OR (:#{#filter.containsPictures} = TRUE AND SIZE(n.racePhotos) > 0)
            OR (:#{#filter.containsPictures} = FALSE AND SIZE(n.racePhotos) = 0)
          )
        ORDER BY n.raceDate DESC
    """,
    )
    fun findAllInfoByFilter(filter: RaceFilter): List<RaceInfoDto>

    @Query(
        """
        SELECT n FROM RaceEntity n
        WHERE n.raceDate >= COALESCE(:#{#filter.from}, n.raceDate)
          AND n.raceDate <= COALESCE(:#{#filter.to}, n.raceDate)
          AND n.isPublished = COALESCE(:#{#filter.isPublished}, n.isPublished)
    """,
    )
    fun findAllByFilter(
        filter: RaceFilter,
        pageable: Pageable,
    ): Page<RaceEntity>

    fun findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(dateTime: LocalDateTime): RaceEntity?

    @Query("SELECT MIN(n.raceDate) FROM RaceEntity n WHERE n.isPublished = true")
    fun findEarliestPublishedRaceDate(): LocalDateTime?
}
