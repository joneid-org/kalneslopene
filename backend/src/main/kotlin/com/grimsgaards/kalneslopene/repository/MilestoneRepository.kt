package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.MilestoneEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MilestoneRepository : JpaRepository<MilestoneEntity, UUID> {
    fun findAllByOrderByYearAsc(): List<MilestoneEntity>
}
