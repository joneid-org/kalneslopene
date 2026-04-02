package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface RunnerRepository : JpaRepository<RunnerEntity, UUID> {
    fun findByNameStartsWithIgnoreCase(name: String): List<RunnerEntity>
}