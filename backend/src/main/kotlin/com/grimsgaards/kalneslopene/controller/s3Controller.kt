package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.service.S3Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/s3")
class S3Controller(
    private val s3Service: S3Service
) {

    @GetMapping("/presigned-url")
    fun getPresignedUrl(
        @RequestParam bucket: String,
        @RequestParam fileName: String,
        @RequestParam(defaultValue = "1") expiryHours: Int
    ): String = s3Service.getPresignedUrl(bucket, fileName, expiryHours)
}