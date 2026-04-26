package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedTagEntity
import com.grimsgaards.kalneslopene.repository.NewsfeedTagRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NewsfeedTagService(
    val newsfeedTagRepository: NewsfeedTagRepository,
) {
    fun getAllTags(): List<NewsfeedTagDTO> =
        newsfeedTagRepository.findAll().map { it.toDto() }

    fun createTag(dto: NewsfeedTagDTO): NewsfeedTagDTO =
        newsfeedTagRepository.save(
            NewsfeedTagEntity(label = dto.label, value = dto.value, color = dto.color)
        ).toDto()

    fun updateTag(uuid: UUID, dto: NewsfeedTagDTO): NewsfeedTagDTO {
        val existing = newsfeedTagRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Tag not found") }
        existing.label = dto.label
        existing.value = dto.value
        existing.color = dto.color
        return newsfeedTagRepository.save(existing).toDto()
    }

    fun deleteTag(uuid: UUID) = newsfeedTagRepository.deleteById(uuid)

    private fun NewsfeedTagEntity.toDto() = NewsfeedTagDTO(uuid, label, value, color)
}

