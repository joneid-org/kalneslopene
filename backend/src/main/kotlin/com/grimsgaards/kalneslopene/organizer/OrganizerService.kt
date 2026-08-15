package com.grimsgaards.kalneslopene.organizer

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class OrganizerService(
    val organizerRepository: OrganizerRepository,
) {
    fun getAllOrganizers(): List<OrganizerDTO> = organizerRepository.findAllByOrderByOrderIndexAsc().map { it.toDto() }

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
                    orderIndex = (organizerRepository.findAll().maxOfOrNull { it.orderIndex } ?: 0.0) + 1,
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

    @Transactional
    fun reorderOrganizer(input: ReorderOrganizerInput): List<OrganizerDTO> {
        val organizers = organizerRepository.findAllByOrderByOrderIndexAsc()
        val moved =
            organizers.find { it.uuid == input.organizerUuid }
                ?: throw NoSuchElementException("Organizer ${input.organizerUuid} not found")
        val others = organizers.filter { it.uuid != input.organizerUuid }

        val anchorUuid = input.beforeOrganizerUuid ?: input.afterOrganizerUuid!!
        val anchorIndex = others.indexOfFirst { it.uuid == anchorUuid }
        require(anchorIndex >= 0) { "Organizer $anchorUuid not found" }

        moved.orderIndex =
            if (input.beforeOrganizerUuid != null) {
                val prev = others.getOrNull(anchorIndex - 1)
                val next = others[anchorIndex]
                if (prev != null) (prev.orderIndex + next.orderIndex) / 2 else next.orderIndex - 1
            } else {
                val prev = others[anchorIndex]
                val next = others.getOrNull(anchorIndex + 1)
                if (next != null) (prev.orderIndex + next.orderIndex) / 2 else prev.orderIndex + 1
            }
        organizerRepository.save(moved)

        return (others + moved).sortedBy { it.orderIndex }.map { it.toDto() }
    }

    fun deleteOrganizer(uuid: UUID) = organizerRepository.deleteById(uuid)
}
