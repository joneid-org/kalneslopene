package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedSettingsDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedSettingsRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.*

@Service
class NewsfeedService(
    val newsfeedRepository: NewsfeedRepository,
    val newsfeedSettingsRepository: NewsfeedSettingsRepository,
) {
    private fun maxArticles(): Int =
        newsfeedSettingsRepository.findAll().firstOrNull()?.maxArticles ?: 10

    fun getSpecifiedNumberOfNewsfeed(): List<NewsfeedDTO> {
        return newsfeedRepository.findAllSortedAndLimited(maxArticles()).map { it.toDto() }
    }

    fun getSettings(): NewsfeedSettingsDTO =
        NewsfeedSettingsDTO(maxArticles())

    fun updateSettings(dto: NewsfeedSettingsDTO): NewsfeedSettingsDTO {
        val existing = newsfeedSettingsRepository.findAll().firstOrNull()
            ?: com.grimsgaards.kalneslopene.model.entities.NewsfeedSettingsEntity()
        existing.maxArticles = dto.maxArticles
        newsfeedSettingsRepository.save(existing)
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

    fun updateNewsfeed(updatedNewsfeed: NewsfeedInput, uuid: UUID? = null): NewsfeedDTO {
        val resolvedUuid = updatedNewsfeed.uuid ?: uuid ?: throw IllegalArgumentException("UUID must be provided")
        val existingNews = newsfeedRepository.findById(resolvedUuid)
            .orElseThrow { NoSuchElementException("Newsfeed with uuid $resolvedUuid not found") }

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

    /** Runs every day at 03:00 — deletes newsfeeds older than 1 year */
    @Scheduled(cron = "0 0 3 * * *")
    fun deleteOldNewsfeeds() {
        val cutoff = OffsetDateTime.now().minusYears(1)
        val old = newsfeedRepository.findAll().filter { it.date.isBefore(cutoff) }
        if (old.isNotEmpty()) {
            newsfeedRepository.deleteAll(old)
        }
    }
}