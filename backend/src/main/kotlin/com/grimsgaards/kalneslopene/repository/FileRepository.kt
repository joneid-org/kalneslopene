package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.entities.FileEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime
import java.util.UUID

@Repository
interface FileRepository : JpaRepository<FileEntity, UUID> {
    fun findAllByUploadConfirmedAtIsNullAndCreatedAtBefore(cutoff: OffsetDateTime): List<FileEntity>
}