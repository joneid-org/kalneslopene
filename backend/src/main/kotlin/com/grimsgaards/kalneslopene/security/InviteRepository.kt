package com.grimsgaards.kalneslopene.security

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface InviteRepository : JpaRepository<InviteEntity, UUID>
