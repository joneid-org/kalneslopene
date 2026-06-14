package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.MilestoneDTO
import com.grimsgaards.kalneslopene.model.input.MilestoneInput
import com.grimsgaards.kalneslopene.service.MilestoneService
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
@RequestMapping("/api/milestones")
class MilestoneController(
    val milestoneService: MilestoneService,
) {
    @GetMapping
    fun getAllMilestones(): List<MilestoneDTO> = milestoneService.getAllMilestones()

    @GetMapping("/{uuid}")
    fun getMilestoneById(
        @PathVariable uuid: UUID,
    ): MilestoneDTO = milestoneService.getMilestone(uuid)

    @PostMapping()
    fun createMilestone(
        @RequestBody milestone: MilestoneInput,
    ): MilestoneDTO = milestoneService.createMilestone(milestone)

    @PatchMapping("/{uuid}")
    fun updateMilestone(
        @PathVariable uuid: UUID,
        @RequestBody milestone: MilestoneInput,
    ): MilestoneDTO = milestoneService.updateMilestone(milestone, uuid)

    @DeleteMapping("/{uuid}")
    fun deleteMilestone(
        @PathVariable uuid: UUID,
    ) {
        milestoneService.deleteMilestone(uuid)
    }
}
