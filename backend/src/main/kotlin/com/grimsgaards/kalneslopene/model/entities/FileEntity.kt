package com.grimsgaards.kalneslopene.model.entities;

import com.grimsgaards.kalneslopene.model.dto.FileDto
import jakarta.persistence.Entity;
import jakarta.persistence.Id
import jakarta.persistence.Table;
import java.time.OffsetDateTime

import java.util.UUID;

@Entity
@Table(name = "file")
class FileEntity(
    val url: String,
) {
    @Id
    val uuid: UUID = UUID.randomUUID()
    val createdAt: OffsetDateTime = OffsetDateTime.now()
    var uploadConfirmedAt: OffsetDateTime? = null
        set(value) {
          require(field == null) { "upload has already been confirmed" }
          field = value
      }

    fun toDto(): FileDto? {
        if (uploadConfirmedAt != null ) return toDtoDangerously()
        return null
    }

    fun toDtoDangerously(): FileDto = FileDto(uuid, url)
}
