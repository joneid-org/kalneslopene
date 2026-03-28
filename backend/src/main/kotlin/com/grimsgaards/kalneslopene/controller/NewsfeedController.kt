package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.service.NewsfeedService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/newsfeeds")
class NewsfeedController(
    val newsfeedService: NewsfeedService
) {

    @GetMapping
    fun getNewsFeedList(): List<NewsfeedDTO> {
        return newsfeedService.getSpecifiedNumberOfNewsfeed()
    }

    @GetMapping("/{uuid}")
    fun getNewsFeed(@PathVariable uuid: UUID): NewsfeedDTO {
        return newsfeedService.findByUuid(uuid)
    }

    @PatchMapping("/{uuid}")
    fun updateNewsFeed(@PathVariable uuid: UUID, @RequestBody newsfeed: NewsfeedDTO): NewsfeedDTO {
        return newsfeedService.updateNewsfeed(newsfeed, uuid)
    }

    @PostMapping("/createNewsfeed")
    fun createNewsFeed(@RequestBody newsfeed: NewsfeedDTO): NewsfeedDTO {
        return newsfeedService.createNewsfeed(newsfeed)
    }

    @DeleteMapping("/{uuid}")
    fun deleteNewsFeed(@PathVariable uuid: UUID) {
        return newsfeedService.deleteNewsfeed(uuid)
    }

}
