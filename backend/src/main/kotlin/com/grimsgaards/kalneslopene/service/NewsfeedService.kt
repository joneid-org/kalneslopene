package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.PagedResponse
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NewsfeedService(
    val newsfeedRepository: NewsfeedRepository,
    val s3Service: S3Service,
) {
    fun getNewsfeedPage(
        page: Int,
        pageSize: Int,
        tag: String? = null,
    ): PagedResponse<NewsfeedDTO> {
        val pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "date"))
        val result =
            if (tag.isNullOrBlank()) {
                newsfeedRepository.findAll(pageable)
            } else {
                newsfeedRepository.findByTagIgnoreCase(tag, pageable)
            }
        return PagedResponse(
            content = result.content.map { it.toDto() },
            page = result.number,
            pageSize = result.size,
            totalElements = result.totalElements,
            totalPages = result.totalPages,
        )
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

    fun createContentImageUpload(fileName: String): PhotoUploadInfo {
        val key = "newsfeed-content/${UUID.randomUUID()}/$fileName"
        val file = s3Service.createAndSaveFileEntity(key)
        return PhotoUploadInfo(
            uploadUrl = s3Service.getPresignedUrl(key),
            s3File = file.toDtoDangerously(),
        )
    }

    fun createNewsfeed(newsfeed: NewsfeedInput): NewsfeedDTO {
        val headerImage = newsfeed.headerImageUuid?.let { s3Service.confirmUpload(it) }
        val saved =
            newsfeedRepository
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
        s3Service.confirmUploadsByUrl(s3Service.extractBucketImageUrls(newsfeed.content))
        return saved
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

        val oldContentImageUrls = s3Service.extractBucketImageUrls(existingNews.content)
        val newContentImageUrls = s3Service.extractBucketImageUrls(updatedNewsfeed.content)

        existingNews.apply {
            tags = updatedNewsfeed.tags
            header = updatedNewsfeed.header
            content = updatedNewsfeed.content
            date = updatedNewsfeed.date
            images = updatedNewsfeed.images
        }

        val saved = newsfeedRepository.save(existingNews).toDto()

        s3Service.confirmUploadsByUrl(newContentImageUrls)

        // Delete the replaced/removed files only after the newsfeed no longer references them.
        if (newHeaderImageUuid != oldHeaderImageUuid && oldHeaderImageUuid != null) {
            s3Service.deleteFilesByUuid(listOf(oldHeaderImageUuid))
        }
        s3Service.deleteFilesByUrl(oldContentImageUrls - newContentImageUrls)

        return saved
    }

    fun deleteNewsfeed(uuid: UUID) {
        val existing = newsfeedRepository.findById(uuid).orElse(null)
        val headerImageUuid = existing?.headerImage?.uuid
        val contentImageUrls = existing?.content?.let { s3Service.extractBucketImageUrls(it) } ?: emptySet()
        newsfeedRepository.deleteById(uuid)
        if (headerImageUuid != null) {
            s3Service.deleteFilesByUuid(listOf(headerImageUuid))
        }
        s3Service.deleteFilesByUrl(contentImageUrls)
    }
}
