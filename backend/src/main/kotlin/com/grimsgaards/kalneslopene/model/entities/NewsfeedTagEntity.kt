package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "newsfeed_tag")
data class NewsfeedTagEntity(
    @Id
    val value: String,
    var label: String,
    var color: String,
) {
    fun toDto() = NewsfeedTagDTO(label, value, color)
}

