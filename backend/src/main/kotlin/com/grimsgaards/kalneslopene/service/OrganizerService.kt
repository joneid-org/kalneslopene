package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.model.entities.OrganizerEntity
import com.grimsgaards.kalneslopene.model.input.OrganizerInput
import com.grimsgaards.kalneslopene.repository.OrganizerRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class OrganizerService(
    val organizerRepository: OrganizerRepository,
) {
    fun getAllOrganizers(): List<OrganizerDTO> = organizerRepository.findAll().map { it.toDto() }

    fun getOrganizer(uuid: UUID): OrganizerDTO = organizerRepository.findById(uuid).get().toDto()

    fun createOrganizer(organizer: OrganizerInput): OrganizerDTO =
        organizerRepository
            .save(
                OrganizerEntity(
                    name = organizer.name,
                    responsibility = organizer.responsibility,
                    initials = organizer.initials,
                    phone = organizer.phone,
                    email = organizer.email,
                    contactperson = organizer.contactPerson,
                    image = organizer.image,
                ),
            ).toDto()

    fun updateOrganizer(
        uuid: UUID,
        updatedOrganizer: OrganizerInput,
    ): OrganizerDTO {
        val existingOrganizer =
            organizerRepository
                .findById(uuid)
                .orElseThrow { NoSuchElementException("Organizer with uuid $uuid not found") }

        existingOrganizer.apply {
            name = updatedOrganizer.name
            responsibility = updatedOrganizer.responsibility
            initials = updatedOrganizer.initials
            phone = updatedOrganizer.phone
            email = updatedOrganizer.email
            image = updatedOrganizer.image
        }

        return organizerRepository.save(existingOrganizer).toDto()
    }

    fun deleteOrganizer(uuid: UUID) = organizerRepository.deleteById(uuid)
}
