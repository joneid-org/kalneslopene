package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsFeedDTO
import com.grimsgaards.kalneslopene.repository.NewsFeedRepository
import org.springframework.stereotype.Service

@Service
class NewsFeedService(
    val newsFeedRepository: NewsFeedRepository
) {
    fun getAllNews(): List<NewsFeedDTO> {
        return newsFeedRepository.findAll().map { it.toDto() }
    }

    fun getLatestNews(amount: Int): List<NewsFeedDTO> {
        return newsFeedRepository.findAll()
            .sortedByDescending { it.date }
            .take(amount)
            .map { it.toDto() }
    }
}
