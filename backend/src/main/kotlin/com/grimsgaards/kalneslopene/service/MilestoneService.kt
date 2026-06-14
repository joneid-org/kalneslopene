package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.MilestoneDTO
import com.grimsgaards.kalneslopene.model.entities.MilestoneEntity
import com.grimsgaards.kalneslopene.model.input.MilestoneInput
import com.grimsgaards.kalneslopene.repository.MilestoneRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class MilestoneService(
    val milestoneRepository: MilestoneRepository,
) {
    fun getAllMilestones(): List<MilestoneDTO> = milestoneRepository.findAllByOrderByYearAsc().map { it.toDto() }

    fun getMilestone(uuid: UUID): MilestoneDTO = milestoneRepository.findById(uuid).get().toDto()

    fun createMilestone(milestone: MilestoneInput): MilestoneDTO =
        milestoneRepository
            .save(
                MilestoneEntity(
                    year = milestone.year,
                    icon = milestone.icon,
                    title = milestone.title,
                    summary = milestone.summary,
                    extra = milestone.extra,
                    details = milestone.details,
                ),
            ).toDto()

    fun updateMilestone(
        updatedMilestone: MilestoneInput,
        uuid: UUID? = null,
    ): MilestoneDTO {
        val resolvedUuid = updatedMilestone.uuid ?: uuid ?: throw IllegalArgumentException("UUID must be provided")
        val existing =
            milestoneRepository
                .findById(resolvedUuid)
                .orElseThrow { NoSuchElementException("Milestone with uuid $resolvedUuid not found") }

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
