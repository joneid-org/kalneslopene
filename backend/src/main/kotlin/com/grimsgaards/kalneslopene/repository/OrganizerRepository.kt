package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.OrganizerEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrganizerRepository : JpaRepository<OrganizerEntity, UUID>
