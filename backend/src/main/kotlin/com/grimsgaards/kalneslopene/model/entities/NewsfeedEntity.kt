package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.*

@Entity
@Table(name = "newsfeed")
data class NewsfeedEntity(

    var tags: List<String>,
    var header: String,
    var content: String,
    var date: OffsetDateTime,

    @Column(name = "header_image", columnDefinition = "TEXT")
    var headerImage: String? = null,

    @Column(name = "images", columnDefinition = "TEXT[]")
    var images: List<String> = emptyList(),

) {

    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): NewsfeedDTO {
        return NewsfeedDTO(uuid, tags, header, content, date, headerImage, images)
    }

}