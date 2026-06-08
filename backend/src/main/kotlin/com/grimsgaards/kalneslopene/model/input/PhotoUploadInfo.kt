package com.grimsgaards.kalneslopene.model.input

import com.grimsgaards.kalneslopene.model.dto.FileDto

data class PhotoUploadInfo(
    val uploadUrl: String,
    val s3File: FileDto,
)