package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.MilestoneDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "milestone")
data class MilestoneEntity(
    var year: String,
    var icon: String,
    var title: String,
    var summary: String,
    var extra: String?,
    var details: List<String>,
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): MilestoneDTO = MilestoneDTO(uuid, year, icon, title, summary, extra, details)
}
