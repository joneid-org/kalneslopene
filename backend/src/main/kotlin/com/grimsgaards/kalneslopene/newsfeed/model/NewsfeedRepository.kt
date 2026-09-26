package com.grimsgaards.kalneslopene.newsfeed.model

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

    @Query("SELECT n FROM NewsfeedEntity n WHERE :publishedOnly = false OR n.isPublished = true")
    fun findAllByPublished(
        @Param("publishedOnly") publishedOnly: Boolean,
        pageable: Pageable,
    ): Page<NewsfeedEntity>

    @Query(
        value = TAG_FILTER_QUERY,
        countQuery = "SELECT count(*) FROM ($TAG_FILTER_QUERY) filtered",
        nativeQuery = true,
    )
    fun findByTagIgnoreCase(
        @Param("tag") tag: String,
        @Param("publishedOnly") publishedOnly: Boolean,
        pageable: Pageable,
    ): Page<NewsfeedEntity>

    companion object {
        private const val TAG_FILTER_QUERY =
            "SELECT * FROM newsfeed WHERE (:publishedOnly = false OR is_published) " +
                "AND EXISTS (SELECT 1 FROM unnest(tags) tag WHERE lower(tag) = lower(:tag))"
    }
}
