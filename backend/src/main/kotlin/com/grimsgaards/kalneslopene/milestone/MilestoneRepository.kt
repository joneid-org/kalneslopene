package com.grimsgaards.kalneslopene.milestone

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface MilestoneRepository : JpaRepository<MilestoneEntity, UUID> {
    fun findAllByOrderByYearAsc(): List<MilestoneEntity>
}
