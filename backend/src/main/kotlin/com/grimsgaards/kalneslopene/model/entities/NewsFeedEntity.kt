package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.NewsFeedDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.*

@Entity
@Table(name = "newsfeed")
data class NewsFeedEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: OffsetDateTime,
) {
    fun toDto(): NewsFeedDTO {
        return NewsFeedDTO(uuid, tags, header, content, date)
    }
}