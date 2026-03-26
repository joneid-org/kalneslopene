package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "newsfeed")
data class NewsfeedEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: LocalDateTime

) {
    fun toDto(): NewsfeedDTO {
        return NewsfeedDTO(uuid, tags, header, content, date)
    }
}