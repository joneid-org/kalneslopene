package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class NewsfeedService(
    val newsfeedRepository: NewsfeedRepository
) {
    val NUMBER_OF_NEWSFEEDS = 10

    fun getSpecifiedNumberOfNewsfeed() : List<NewsfeedDTO> {
        return newsfeedRepository.findAllSortedAndLimited(NUMBER_OF_NEWSFEEDS).map { it.toDto() }
    }
    fun findByUuid(uuid: UUID): NewsfeedDTO {
        return newsfeedRepository.findById(uuid).get().toDto()
    }

    fun createNewsfeed(newsfeed: NewsfeedDTO): NewsfeedDTO {
        return newsfeedRepository.save(NewsfeedEntity(
            tags = newsfeed.tags,
            header = newsfeed.header,
            content = newsfeed.content,
            date = newsfeed.date,
            headerImage = newsfeed.headerImage,
            images = newsfeed.images,
        )).toDto()
    }

    fun updateNewsfeed(updatedNewsfeed: NewsfeedDTO, uuid: UUID): NewsfeedDTO {
        val existingNews = newsfeedRepository.findById(uuid)
            .orElseThrow { NoSuchElementException("Newsfeed with uuid $uuid not found") }

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