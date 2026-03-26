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
    fun getAllNewsfeed(): List<NewsfeedDTO> {
        return newsfeedRepository.findAll().sortedByDescending { it.date }.map { it.toDto()}
    }
    fun getSpecifiedNumberOfNewsfeed(amount: Int) : List<NewsfeedDTO> {
        return newsfeedRepository.findAll().sortedByDescending { it.date }.take(amount).map { it.toDto() }
    }
    fun findByUuid(uuid: UUID): NewsfeedDTO {
        return newsfeedRepository.findByUuid(uuid).toDto()
    }

    fun createNewsfeed(newsfeed: NewsfeedDTO): NewsfeedDTO {
        return newsfeedRepository.save(NewsfeedEntity(
            tags = newsfeed.tags,
            header = newsfeed.header,
            content = newsfeed.content,
            date = newsfeed.date
        )).toDto()
    }

    fun updateNewsfeed(newsfeed: NewsfeedDTO): NewsfeedDTO {
        if (newsfeed.uuid === null) throw IllegalArgumentException("uuid is required for update")

        return newsfeedRepository.save(NewsfeedEntity(
            uuid = newsfeed.uuid,
            tags = newsfeed.tags,
            header = newsfeed.header,
            content = newsfeed.content,
            date = newsfeed.date
        )).toDto()
    }

    fun deleteNewsfeed(uuid: UUID) {
        newsfeedRepository.deleteById(uuid)
    }
}