package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.model.entities.OrganizerEntity
import com.grimsgaards.kalneslopene.repository.OrganizerRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class OrganizerService(
    val organizerRepository: OrganizerRepository
) {
    fun getAllOrganizers(): List<OrganizerDTO> {
       return organizerRepository.findAll().map { it.toDto() }
    }

    fun getOrganizer(id: UUID): OrganizerDTO {
        return organizerRepository.findByUuid(id).toDto()
    }

    fun createOrganizer(organizer: OrganizerDTO): OrganizerDTO {
        return organizerRepository.save(OrganizerEntity(
            name = organizer.name,
            responsibility = organizer.responsibility,
            initials = organizer.initials,
            phone = organizer.phone,
            email = organizer.email
        )).toDto()
    }

    fun updateOrganizer(organizer: OrganizerDTO): OrganizerDTO {
        if (organizer.uuid === null) throw IllegalArgumentException("uuid is required for update")

        return organizerRepository.save(OrganizerEntity(
            uuid = organizer.uuid,
            name = organizer.name,
            responsibility = organizer.responsibility,
            initials = organizer.initials,
            phone = organizer.phone,
            email = organizer.email
        )).toDto()
    }

    fun deleteOrganizer(uuid: UUID) {
        return organizerRepository.deleteById(uuid)
    }
}