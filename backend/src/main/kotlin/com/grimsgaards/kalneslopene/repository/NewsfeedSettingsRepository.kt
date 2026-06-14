package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.NewsfeedSettingsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsfeedSettingsRepository : JpaRepository<NewsfeedSettingsEntity, Long>
