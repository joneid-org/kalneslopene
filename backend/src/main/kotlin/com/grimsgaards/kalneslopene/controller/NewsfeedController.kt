package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedSettingsDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import com.grimsgaards.kalneslopene.service.NewsfeedService
import com.grimsgaards.kalneslopene.service.NewsfeedTagService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/newsfeeds")
class NewsfeedController(
    val newsfeedService: NewsfeedService,
    val newsfeedTagService: NewsfeedTagService,
) {

    @GetMapping
    fun getNewsFeedList(): List<NewsfeedDTO> = newsfeedService.getSpecifiedNumberOfNewsfeed()

    @GetMapping("/{uuid}")
    fun getNewsFeed(@PathVariable uuid: UUID): NewsfeedDTO = newsfeedService.findByUuid(uuid)

    @PatchMapping("/{uuid}")
    fun updateNewsFeed(@PathVariable uuid: UUID, @RequestBody newsfeed: NewsfeedDTO): NewsfeedDTO =
        newsfeedService.updateNewsfeed(newsfeed, uuid)

    @PostMapping("/createNewsfeed")
    fun createNewsFeed(@RequestBody newsfeed: NewsfeedDTO): NewsfeedDTO =
        newsfeedService.createNewsfeed(newsfeed)

    @DeleteMapping("/{uuid}")
    fun deleteNewsFeed(@PathVariable uuid: UUID) = newsfeedService.deleteNewsfeed(uuid)

    // ── Settings ────────────────────────────────────────────────────────────────

    @GetMapping("/settings")
    fun getSettings(): NewsfeedSettingsDTO = newsfeedService.getSettings()

    @PatchMapping("/settings")
    fun updateSettings(@RequestBody dto: NewsfeedSettingsDTO): NewsfeedSettingsDTO =
        newsfeedService.updateSettings(dto)

    // ── Tags ────────────────────────────────────────────────────────────────────

    @GetMapping("/tags")
    fun getTags(): List<NewsfeedTagDTO> = newsfeedTagService.getAllTags()

    @PostMapping("/tags")
    fun createTag(@RequestBody dto: NewsfeedTagDTO): NewsfeedTagDTO =
        newsfeedTagService.createTag(dto)

    @PatchMapping("/tags/{uuid}")
    fun updateTag(@PathVariable uuid: UUID, @RequestBody dto: NewsfeedTagDTO): NewsfeedTagDTO =
        newsfeedTagService.updateTag(uuid, dto)

    @DeleteMapping("/tags/{uuid}")
    fun deleteTag(@PathVariable uuid: UUID) = newsfeedTagService.deleteTag(uuid)
}
