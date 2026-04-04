package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "users")
data class UserEntity(

    var username: String,
    var password: String,
    var roles: String = "ROLE_USER",

) {
    @Id
    val uuid: UUID = UUID.randomUUID()
}

