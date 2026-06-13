package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface NewsfeedRepository : JpaRepository<NewsfeedEntity, UUID> {
    @Query("SELECT n FROM NewsfeedEntity n ORDER BY n.date DESC LIMIT :limit")
    fun findAllSortedAndLimited(limit: Int): List<NewsfeedEntity>
}
