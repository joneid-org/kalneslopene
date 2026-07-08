package com.grimsgaards.kalneslopene.model.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "race_result_draft")
data class ResultDraftEntity(
    @Id
    @Column(name = "race_uuid")
    val raceUuid: UUID,
    @JdbcTypeCode(SqlTypes.JSON)
    var data: String,
    var updatedAt: LocalDateTime,
)
