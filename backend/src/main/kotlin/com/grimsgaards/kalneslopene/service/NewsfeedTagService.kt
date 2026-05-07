package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedTagEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedTagInput
import com.grimsgaards.kalneslopene.repository.NewsfeedTagRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NewsfeedTagService(
    val newsfeedTagRepository: NewsfeedTagRepository,
) {
    fun getAllTags(): List<NewsfeedTagDTO> =
        newsfeedTagRepository.findAll().map { it.toDto() }

    fun createTag(dto: NewsfeedTagInput): NewsfeedTagDTO =
        newsfeedTagRepository.save(
            NewsfeedTagEntity(label = dto.label, value = dto.value, color = dto.color)
        ).toDto()

    fun updateTag(uuid: UUID? = null, dto: NewsfeedTagInput): NewsfeedTagDTO {
        val resolvedUuid = dto.uuid ?: uuid ?: throw IllegalArgumentException("UUID must be provided")
        val existing = newsfeedTagRepository.findById(resolvedUuid)
            .orElseThrow { NoSuchElementException("Tag not found") }
        existing.label = dto.label
        existing.value = dto.value
        existing.color = dto.color
        return newsfeedTagRepository.save(existing).toDto()
    }

    fun deleteTag(uuid: UUID) = newsfeedTagRepository.deleteById(uuid)

    private fun NewsfeedTagEntity.toDto() = NewsfeedTagDTO(uuid, label, value, color)
}

