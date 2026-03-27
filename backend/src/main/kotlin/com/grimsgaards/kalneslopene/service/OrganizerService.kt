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

    fun getOrganizer(uuid: UUID): OrganizerDTO {
        return organizerRepository.findById(uuid).get().toDto()
    }

    fun createOrganizer(organizer: OrganizerDTO): OrganizerDTO {
        return organizerRepository.save(
            OrganizerEntity(
                name = organizer.name,
                responsibility = organizer.responsibility,
                initials = organizer.initials,
                phone = organizer.phone,
                email = organizer.email
            )
        ).toDto()
    }

    fun updateOrganizer(updatedOrganizer: OrganizerDTO, uuid: UUID): OrganizerDTO {
        val existingOrganizer = organizerRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Organizer with uuid $uuid not found") }

        existingOrganizer.apply {
            name = updatedOrganizer.name
            responsibility = updatedOrganizer.responsibility
            initials = updatedOrganizer.initials
            phone = updatedOrganizer.phone
            email = updatedOrganizer.email
        }

        return organizerRepository.save(existingOrganizer).toDto()
    }

    fun deleteOrganizer(uuid: UUID) {
        return organizerRepository.deleteById(uuid)
    }
}