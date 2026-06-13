package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.NewsfeedTagEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsfeedTagRepository : JpaRepository<NewsfeedTagEntity, String>
