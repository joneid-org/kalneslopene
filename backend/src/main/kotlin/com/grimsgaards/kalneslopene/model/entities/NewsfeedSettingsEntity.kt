package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.*

@Entity
@Table(name = "newsfeed_settings")
data class NewsfeedSettingsEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var maxArticles: Int = 10,
)

