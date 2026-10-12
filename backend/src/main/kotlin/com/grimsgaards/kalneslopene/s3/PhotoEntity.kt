package com.grimsgaards.kalneslopene.s3

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.PostLoad
import jakarta.persistence.PostPersist
import jakarta.persistence.Table
import jakarta.persistence.Transient
import org.springframework.data.domain.Persistable
import java.util.UUID

@Entity
@Table(name = "photo")
class PhotoEntity(
    @OneToOne
    @JoinColumn(name = "photo_file_uuid")
    val photoFile: FileEntity,
    @OneToOne
    @JoinColumn(name = "thumbnail_file_uuid")
    var thumbnailFile: FileEntity? = null,
) : Persistable<UUID> {
    @Id
    val uuid: UUID = UUID.randomUUID()

    @Transient
    private var new: Boolean = true

    override fun getId(): UUID = uuid

    override fun isNew(): Boolean = new

    @PostLoad
    @PostPersist
    fun markNotNew() {
        new = false
    }

    /** Null until the photo itself is confirmed; an unconfirmed thumbnail is left out. */
    fun toDto(): PhotoDto? {
        val photo = photoFile.toDto() ?: return null
        return PhotoDto(uuid, photo.url, thumbnailFile?.toDto()?.url)
    }

    fun toDtoDangerously(): PhotoDto = PhotoDto(uuid, photoFile.url, thumbnailFile?.url)
}
