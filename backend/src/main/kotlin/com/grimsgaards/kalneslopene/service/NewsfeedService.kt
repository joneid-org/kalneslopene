package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedSettingsDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedSettingsEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedSettingsRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class NewsfeedService(
    val newsfeedRepository: NewsfeedRepository,
    val newsfeedSettingsRepository: NewsfeedSettingsRepository,
) {
    private var settings = getSettingsEntity()

    private fun getSettingsEntity(): NewsfeedSettingsEntity =
        newsfeedSettingsRepository.findAll().firstOrNull() ?: newsfeedSettingsRepository.save(
            NewsfeedSettingsEntity(
                maxArticles = 10
            )
        )

    fun getSettings(): NewsfeedSettingsDTO = NewsfeedSettingsDTO(settings.maxArticles)

    fun getSpecifiedNumberOfNewsfeed(): List<NewsfeedDTO> {
        return newsfeedRepository.findAllSortedAndLimited(settings.maxArticles).map { it.toDto() }
    }


    fun updateSettings(dto: NewsfeedSettingsDTO): NewsfeedSettingsDTO {
        val existing = getSettingsEntity()
        existing.maxArticles = dto.maxArticles
        newsfeedSettingsRepository.save(existing)
        settings = existing
        return NewsfeedSettingsDTO(existing.maxArticles)
    }

    fun findByUuid(uuid: UUID): NewsfeedDTO {
        return newsfeedRepository.findById(uuid).get().toDto()
    }

    fun createNewsfeed(newsfeed: NewsfeedInput): NewsfeedDTO {
        return newsfeedRepository.save(
            NewsfeedEntity(
                tags = newsfeed.tags,
                header = newsfeed.header,
                content = newsfeed.content,
                date = newsfeed.date,
                headerImage = newsfeed.headerImage,
                images = newsfeed.images,
            )
        ).toDto()
    }

    fun updateNewsfeed(uuid: UUID, updatedNewsfeed: NewsfeedInput): NewsfeedDTO {
        val existingNews = newsfeedRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Newsfeed with uuid ${updatedNewsfeed.uuid} not found") }

        existingNews.apply {
            tags = updatedNewsfeed.tags
            header = updatedNewsfeed.header
            content = updatedNewsfeed.content
            date = updatedNewsfeed.date
            headerImage = updatedNewsfeed.headerImage
            images = updatedNewsfeed.images
        }

        return newsfeedRepository.save(existingNews).toDto()
    }

    fun deleteNewsfeed(uuid: UUID) {
        newsfeedRepository.deleteById(uuid)
    }
}