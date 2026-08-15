package com.grimsgaards.kalneslopene.organizer

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/organizers")
class OrganizerController(
    val organizerService: OrganizerService,
) {
    @GetMapping
    fun getAllOrganizers(): List<OrganizerDTO> = organizerService.getAllOrganizers()

    @GetMapping("/{uuid}")
    fun getOrganizerById(
        @PathVariable uuid: UUID,
    ): OrganizerDTO = organizerService.getOrganizer(uuid)

    @PatchMapping("/{uuid}")
    fun updateOrganizer(
        @PathVariable uuid: UUID,
        @RequestBody organizer: OrganizerInput,
    ): OrganizerDTO = organizerService.updateOrganizer(uuid, organizer)

    @PatchMapping("/order")
    fun reorderOrganizer(
        @RequestBody input: ReorderOrganizerInput,
    ): List<OrganizerDTO> = organizerService.reorderOrganizer(input)

    @PostMapping("/createOrganizer")
    fun createOrganizer(
        @RequestBody organizer: OrganizerInput,
    ): OrganizerDTO = organizerService.createOrganizer(organizer)

    @DeleteMapping("/{uuid}")
    fun deleteOrganizer(
        @PathVariable uuid: UUID,
    ) {
        organizerService.deleteOrganizer(uuid)
    }
}
