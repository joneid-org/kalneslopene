package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface NewsfeedRepository : JpaRepository<NewsfeedEntity, UUID> {
    fun findByUuid(uuid: UUID): NewsfeedEntity
}