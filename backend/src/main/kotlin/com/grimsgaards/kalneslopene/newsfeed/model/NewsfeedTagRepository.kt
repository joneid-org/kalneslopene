package com.grimsgaards.kalneslopene.newsfeed.model

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsfeedTagRepository : JpaRepository<NewsfeedTagEntity, String>
