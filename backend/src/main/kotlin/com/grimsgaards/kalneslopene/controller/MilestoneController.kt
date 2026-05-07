package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.MilestoneDTO
import com.grimsgaards.kalneslopene.model.input.MilestoneInput
import com.grimsgaards.kalneslopene.service.MilestoneService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/milestones")
class MilestoneController(
    val milestoneService: MilestoneService
) {
    @GetMapping
    fun getAllMilestones(): List<MilestoneDTO> {
        return milestoneService.getAllMilestones()
    }

    @GetMapping("/{uuid}")
    fun getMilestoneById(@PathVariable uuid: UUID): MilestoneDTO {
        return milestoneService.getMilestone(uuid)
    }

    @PostMapping("/createMilestone")
    fun createMilestone(@RequestBody milestone: MilestoneInput): MilestoneDTO {
        return milestoneService.createMilestone(milestone)
    }

    @PatchMapping("/{uuid}")
    fun updateMilestone(@PathVariable uuid: UUID, @RequestBody milestone: MilestoneInput): MilestoneDTO {
        return milestoneService.updateMilestone(milestone, uuid)
    }

    @DeleteMapping("/{uuid}")
    fun deleteMilestone(@PathVariable uuid: UUID) {
        milestoneService.deleteMilestone(uuid)
    }
}