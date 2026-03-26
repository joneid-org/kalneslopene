package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.service.NewsfeedService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/newsfeed")
class NewsfeedController(
    val newsfeedService: NewsfeedService
) {

    @GetMapping("")
    fun getNewsFeedList(@RequestParam amount: Int?): List<NewsfeedDTO> {
        return if (amount != null) {
            newsfeedService.getSpecifiedNumberOfNewsfeed(amount)
        } else {
            newsfeedService.getAllNewsfeed()
        }
    }

    @GetMapping("/{uuid}")
    fun getNewsFeed(@PathVariable uuid: UUID): NewsfeedDTO {
        return newsfeedService.findByUuid(uuid)
    }

    @PatchMapping("")
    fun updateNewsFeed(@RequestBody newsfeed: NewsfeedDTO): NewsfeedDTO {
        return newsfeedService.updateNewsfeed(newsfeed)
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
