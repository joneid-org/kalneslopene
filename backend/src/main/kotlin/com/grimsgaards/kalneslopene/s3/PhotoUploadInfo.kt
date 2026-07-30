package com.grimsgaards.kalneslopene.s3

data class PhotoUploadInfo(
    val uploadUrl: String,
    val s3File: FileDto,
)
