package com.grimsgaards.kalneslopene.newsfeed.model

import com.grimsgaards.kalneslopene.newsfeed.dto.NewsfeedTagDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "newsfeed_tag")
data class NewsfeedTagEntity(
    @Id
    val value: String,
    var color: String,
) {
    fun toDto() = NewsfeedTagDTO(value, color)
}
