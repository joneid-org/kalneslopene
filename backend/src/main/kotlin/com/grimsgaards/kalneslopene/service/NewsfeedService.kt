package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedSettingsDTO
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedSettingsEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedSettingsRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NewsfeedService(
    val newsfeedRepository: NewsfeedRepository,
    val newsfeedSettingsRepository: NewsfeedSettingsRepository,
    val s3Service: S3Service,
) {
    private var settings = getSettingsEntity()

    private fun getSettingsEntity(): NewsfeedSettingsEntity =
        newsfeedSettingsRepository.findAll().firstOrNull() ?: newsfeedSettingsRepository.save(
            NewsfeedSettingsEntity(
                maxArticles = 10,
            ),
        )

    fun getSettings(): NewsfeedSettingsDTO = NewsfeedSettingsDTO(settings.maxArticles)

    fun getSpecifiedNumberOfNewsfeed(): List<NewsfeedDTO> =
        newsfeedRepository.findAllSortedAndLimited(settings.maxArticles).map { it.toDto() }

    fun updateSettings(dto: NewsfeedSettingsDTO): NewsfeedSettingsDTO {
        val existing = getSettingsEntity()
        existing.maxArticles = dto.maxArticles
        newsfeedSettingsRepository.save(existing)
        settings = existing
        return NewsfeedSettingsDTO(existing.maxArticles)
    }

    fun findByUuid(uuid: UUID): NewsfeedDTO = newsfeedRepository.findById(uuid).get().toDto()

    fun createHeaderImageUpload(fileName: String): PhotoUploadInfo {
        val key = "newsfeed-photos/${UUID.randomUUID()}/$fileName"
        val file = s3Service.createAndSaveFileEntity(key)
        return PhotoUploadInfo(
            uploadUrl = s3Service.getPresignedUrl(key),
            s3File = file.toDtoDangerously(),
        )
    }

    fun createNewsfeed(newsfeed: NewsfeedInput): NewsfeedDTO {
        val headerImage = newsfeed.headerImageUuid?.let { s3Service.confirmUpload(it) }
        return newsfeedRepository
            .save(
                NewsfeedEntity(
                    tags = newsfeed.tags,
                    header = newsfeed.header,
                    content = newsfeed.content,
                    date = newsfeed.date,
                    headerImage = headerImage,
                    images = newsfeed.images,
                ),
            ).toDto()
    }

    fun updateNewsfeed(
        uuid: UUID,
        updatedNewsfeed: NewsfeedInput,
    ): NewsfeedDTO {
        val existingNews =
            newsfeedRepository
                .findById(uuid)
                .orElseThrow { NoSuchElementException("Newsfeed with uuid ${updatedNewsfeed.uuid} not found") }

        val oldHeaderImageUuid = existingNews.headerImage?.uuid
        val newHeaderImageUuid = updatedNewsfeed.headerImageUuid

        if (newHeaderImageUuid != oldHeaderImageUuid) {
            existingNews.headerImage = newHeaderImageUuid?.let { s3Service.confirmUpload(it) }
        }

        existingNews.apply {
            tags = updatedNewsfeed.tags
            header = updatedNewsfeed.header
            content = updatedNewsfeed.content
            date = updatedNewsfeed.date
            images = updatedNewsfeed.images
        }

        val saved = newsfeedRepository.save(existingNews).toDto()

        // Delete the replaced/removed file only after the newsfeed no longer references it.
        if (newHeaderImageUuid != oldHeaderImageUuid && oldHeaderImageUuid != null) {
            s3Service.deleteFilesByUuid(listOf(oldHeaderImageUuid))
        }

        return saved
    }

    fun deleteNewsfeed(uuid: UUID) {
        val headerImageUuid =
            newsfeedRepository
                .findById(uuid)
                .orElse(null)
                ?.headerImage
                ?.uuid
        newsfeedRepository.deleteById(uuid)
        if (headerImageUuid != null) {
            s3Service.deleteFilesByUuid(listOf(headerImageUuid))
        }
    }
}
