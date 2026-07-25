package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.FileDto
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.PostLoad
import jakarta.persistence.PostPersist
import jakarta.persistence.Table
import jakarta.persistence.Transient
import org.springframework.data.domain.Persistable
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "file")
class FileEntity(
    val url: String,
) : Persistable<UUID> {
    @Id
    val uuid: UUID = UUID.randomUUID()
    val createdAt: OffsetDateTime = OffsetDateTime.now()
    var uploadConfirmedAt: OffsetDateTime? = null
        set(value) {
            require(field == null) { "upload has already been confirmed" }
            field = value
        }

    @Transient
    private var new: Boolean = true

    override fun getId(): UUID = uuid

    override fun isNew(): Boolean = new

    @PostLoad
    @PostPersist
    fun markNotNew() {
        new = false
    }

    fun toDto(): FileDto? {
        if (uploadConfirmedAt != null) return toDtoDangerously()
        return null
    }

    fun toDtoDangerously(): FileDto = FileDto(uuid, url)
}
