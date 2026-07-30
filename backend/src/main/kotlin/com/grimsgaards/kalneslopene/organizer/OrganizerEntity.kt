package com.grimsgaards.kalneslopene.organizer

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "organizer")
data class OrganizerEntity(
    var name: String,
    var responsibility: List<String>,
    var initials: String,
    var phone: String?,
    var email: String?,
    var contactperson: Boolean,
    @Column(name = "image", columnDefinition = "TEXT")
    var image: String? = null,
) {
    @Id
    val uuid: UUID = UUID.randomUUID()

    fun toDto(): OrganizerDTO = OrganizerDTO(uuid, name, responsibility, initials, phone, email, contactperson, image)
}
