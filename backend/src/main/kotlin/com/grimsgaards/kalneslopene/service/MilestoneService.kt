package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.MilestoneDTO
import com.grimsgaards.kalneslopene.model.entities.MilestoneEntity
import com.grimsgaards.kalneslopene.repository.MilestoneRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class MilestoneService(
    val milestoneRepository: MilestoneRepository
) {
    fun getAllMilestones(): List<MilestoneDTO> {
        return milestoneRepository.findAll()
            .sortedBy { it.year }
            .map { it.toDto() }
    }

    fun getMilestone(uuid: UUID): MilestoneDTO {
        return milestoneRepository.findById(uuid).get().toDto()
    }

    fun createMilestone(milestone: MilestoneDTO): MilestoneDTO {
        return milestoneRepository.save(
            MilestoneEntity(
                year = milestone.year,
                icon = milestone.icon,
                title = milestone.title,
                summary = milestone.summary,
                extra = milestone.extra,
                details = milestone.details
            )
        ).toDto()
    }

    fun updateMilestone(updatedMilestone: MilestoneDTO, uuid: UUID): MilestoneDTO {
        val existing = milestoneRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Milestone with uuid $uuid not found") }

        existing.apply {
            year = updatedMilestone.year
            icon = updatedMilestone.icon
            title = updatedMilestone.title
            summary = updatedMilestone.summary
            extra = updatedMilestone.extra
            details = updatedMilestone.details
        }

        return milestoneRepository.save(existing).toDto()
    }

    fun deleteMilestone(uuid: UUID) {
        milestoneRepository.deleteById(uuid)
    }
}