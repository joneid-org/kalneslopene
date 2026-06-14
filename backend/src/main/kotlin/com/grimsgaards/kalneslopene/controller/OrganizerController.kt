package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.model.input.OrganizerInput
import com.grimsgaards.kalneslopene.service.OrganizerService
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
