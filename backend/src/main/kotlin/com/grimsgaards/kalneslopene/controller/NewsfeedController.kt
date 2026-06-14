package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedSettingsDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.model.input.NewsfeedTagInput
import com.grimsgaards.kalneslopene.model.input.NewsfeedTagUpdateInput
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
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
    fun updateNewsFeed(@PathVariable uuid: UUID, @RequestBody input: NewsfeedInput): NewsfeedDTO =
        newsfeedService.updateNewsfeed(uuid, input)

    @PostMapping("/createNewsfeed")
    fun createNewsFeed(@RequestBody newsfeed: NewsfeedInput): NewsfeedDTO =
        newsfeedService.createNewsfeed(newsfeed)

    @PostMapping("/header-image")
    fun uploadHeaderImage(@RequestParam fileName: String): PhotoUploadInfo =
        newsfeedService.createHeaderImageUpload(fileName)

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
    fun createTag(@RequestBody dto: NewsfeedTagInput): NewsfeedTagDTO =
        newsfeedTagService.createTag(dto)

    @PatchMapping("/tags/{value}")
    fun updateTag(@PathVariable value: String, @RequestBody input: NewsfeedTagUpdateInput): NewsfeedTagDTO =
        newsfeedTagService.updateTag(value, input)

    @DeleteMapping("/tags/{value}")
    fun deleteTag(@PathVariable value: String) = newsfeedTagService.deleteTag(value)
}
