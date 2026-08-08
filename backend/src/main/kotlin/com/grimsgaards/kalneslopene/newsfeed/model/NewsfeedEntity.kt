package com.grimsgaards.kalneslopene.newsfeed.model

import com.grimsgaards.kalneslopene.newsfeed.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.s3.FileEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "newsfeed")
data class NewsfeedEntity(
    var tags: List<String>,
    var header: String,
    var content: String,
    var date: OffsetDateTime,
    @ManyToOne(fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST])
    @JoinColumn(name = "header_image_uuid")
    var headerImage: FileEntity? = null,
    @Column(name = "images", columnDefinition = "TEXT[]")
    var images: List<String> = emptyList(),
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): NewsfeedDTO =
        NewsfeedDTO(
            uuid,
            tags,
            header,
            content,
            date,
            headerImage?.toDto(),
            images,
        )
}
