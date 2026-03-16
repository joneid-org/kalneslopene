package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.NewsFeedDTO
import com.grimsgaards.kalneslopene.service.NewsFeedService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/newsFeed")
class NewsFeedController(
    val newsFeedService: NewsFeedService
) {

    @GetMapping("")
    fun getAllNews(): List<NewsFeedDTO> {
        return newsFeedService.getAllNews()
    }

    @GetMapping("/latest")
    fun getSetAmountOfNews(@RequestParam amount: Int): List<NewsFeedDTO> {
        return newsFeedService.getLatestNews(amount)
    }
}