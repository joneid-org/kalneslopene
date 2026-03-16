package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.service.OrganizerService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/organizer")
class OrganizerController(
    val organizerService: OrganizerService
) {

    @GetMapping("")
    fun getAllOrganizers(): List<OrganizerDTO> {
        return organizerService.getAll()
    }
}
