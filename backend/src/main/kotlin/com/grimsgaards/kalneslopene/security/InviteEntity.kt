package com.grimsgaards.kalneslopene.security

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "user_invite")
data class InviteEntity(
    @Enumerated(EnumType.STRING)
    var roles: MutableSet<UserRole>,
    var expiresAt: OffsetDateTime,
    var usedAt: OffsetDateTime? = null,
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): InviteDto = InviteDto(token = uuid, expiresAt = expiresAt, roles = roles)
}

data class InviteDto(
    val token: UUID,
    val expiresAt: OffsetDateTime,
    val roles: Set<UserRole>,
)
