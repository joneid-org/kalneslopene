package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.service.OrganizerService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/organizer")
class OrganizerController(
    val organizerService: OrganizerService
) {
    @GetMapping("")
    fun getAllOrganizers(): List<OrganizerDTO> {
        return organizerService.getAllOrganizers()
    }

    @GetMapping("/{uuid}")
    fun getOrganizerById(@PathVariable uuid: UUID): OrganizerDTO {
        return organizerService.getOrganizer(uuid)
    }

    @PatchMapping("")
    fun updateOrganizer(@RequestBody organizer: OrganizerDTO): OrganizerDTO {
        return organizerService.updateOrganizer(organizer)
    }

    @PostMapping("/createOrganizer")
    fun createOrganizer(@RequestBody organizer: OrganizerDTO): OrganizerDTO {
        return organizerService.createOrganizer(organizer)
    }

    @DeleteMapping("/{uuid}")
    fun deleteOrganizer(@PathVariable uuid: UUID) {
        organizerService.deleteOrganizer(uuid)
    }
}