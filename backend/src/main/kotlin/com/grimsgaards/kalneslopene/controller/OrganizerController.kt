package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.model.input.OrganizerInput
import com.grimsgaards.kalneslopene.service.OrganizerService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/organizers")
class OrganizerController(
    val organizerService: OrganizerService
) {
    @GetMapping
    fun getAllOrganizers(): List<OrganizerDTO> {
        return organizerService.getAllOrganizers()
    }

    @GetMapping("/{uuid}")
    fun getOrganizerById(@PathVariable uuid: UUID): OrganizerDTO {
        return organizerService.getOrganizer(uuid)
    }

    @PatchMapping("/{uuid}")
    fun updateOrganizer(@PathVariable uuid: UUID, @RequestBody organizer: OrganizerInput): OrganizerDTO {
        return organizerService.updateOrganizer(uuid, organizer)
    }

    @PostMapping("/createOrganizer")
    fun createOrganizer(@RequestBody organizer: OrganizerInput): OrganizerDTO {
        return organizerService.createOrganizer(organizer)
    }

    @DeleteMapping("/{uuid}")
    fun deleteOrganizer(@PathVariable uuid: UUID) {
        organizerService.deleteOrganizer(uuid)
    }
}