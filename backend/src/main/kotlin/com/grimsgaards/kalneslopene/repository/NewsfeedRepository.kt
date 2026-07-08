package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NewsfeedRepository : JpaRepository<NewsfeedEntity, UUID> {
    @Query("SELECT n FROM NewsfeedEntity n ORDER BY n.date DESC LIMIT :limit")
    fun findAllSortedAndLimited(limit: Int): List<NewsfeedEntity>

    fun findAllByOrderByDateDesc(): List<NewsfeedEntity>

    @Query(
        value = "SELECT * FROM newsfeed WHERE EXISTS (SELECT 1 FROM unnest(tags) tag WHERE lower(tag) = lower(:tag))",
        countQuery = "SELECT count(*) FROM newsfeed WHERE EXISTS (SELECT 1 FROM unnest(tags) tag WHERE lower(tag) = lower(:tag))",
        nativeQuery = true,
    )
    fun findByTagIgnoreCase(
        @Param("tag") tag: String,
        pageable: Pageable,
    ): Page<NewsfeedEntity>
}
