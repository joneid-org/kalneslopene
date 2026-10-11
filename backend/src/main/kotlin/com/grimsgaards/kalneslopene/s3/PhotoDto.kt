package com.grimsgaards.kalneslopene.s3

import java.util.UUID

data class PhotoDto(
    val uuid: UUID,
    val url: String,
    val thumbnailUrl: String? = null,
)

data class RacePhotoUploadInfo(
    val uploadUrl: String,
    val thumbnailUploadUrl: String,
    val photo: PhotoDto,
)

data class ThumbnailUploadInfo(
    val photo: PhotoDto,
    val uploadUrl: String,
)
