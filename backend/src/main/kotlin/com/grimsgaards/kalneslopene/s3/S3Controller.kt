package com.grimsgaards.kalneslopene.s3

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/s3")
class S3Controller(
    private val s3Service: S3Service,
) {
    @GetMapping("/presigned-url")
    fun getPresignedUrl(
        @RequestParam fileName: String,
        @RequestParam(defaultValue = "1") expiryHours: Int,
    ): String = s3Service.getPresignedUrl(fileName, expiryHours)

    @PostMapping("/presigned-urls")
    fun getPresignedUrls(
        @RequestBody fileNames: List<String>,
        @RequestParam(defaultValue = "1") expiryHours: Int,
    ): Map<String, String> = s3Service.getPresignedUrls(fileNames, expiryHours)

    @DeleteMapping("/files")
    fun deleteFiles(
        @RequestBody fileUuids: List<UUID>,
    ) = s3Service.deleteFilesByUuid(fileUuids)
}
