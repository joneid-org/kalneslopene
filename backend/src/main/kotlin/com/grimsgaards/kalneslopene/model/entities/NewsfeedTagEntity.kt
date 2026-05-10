package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "newsfeed_tag")
data class NewsfeedTagEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),

    var label: String,
    var value: String,
    var color: String,
)

