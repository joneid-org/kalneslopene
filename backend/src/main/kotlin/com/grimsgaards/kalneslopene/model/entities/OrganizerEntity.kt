package com.grimsgaards.kalneslopene.model.entities

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "organizer")
data class OrganizerEntity(
    @Id
    val uuid: UUID = UUID.randomUUID(),
    val name: String,
    val responsibility: List<String>,
    val initials: String,
    val phone: String?,
    val email: String?
) {
    fun toDto(): OrganizerDTO {
        return OrganizerDTO(uuid, name, responsibility, initials, phone, email)
    }
}