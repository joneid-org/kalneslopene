package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "users")
data class UserEntity(

    var username: String,
    var password: String,

    @Enumerated(EnumType.STRING)
    var roles: MutableSet<UserRole>,
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    init {
        println(roles)
    }
}

enum class UserRole {
    ADMIN,
}