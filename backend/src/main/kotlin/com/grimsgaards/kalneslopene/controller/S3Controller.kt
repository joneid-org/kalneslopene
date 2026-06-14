package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.service.S3Service
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
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

    @PatchMapping("/files/{uuid}/confirm-upload")
    fun confirmUpload(
        @PathVariable uuid: UUID,
    ) = s3Service.confirmUpload(uuid)

    @DeleteMapping("/files")
    fun deleteFiles(
        @RequestBody fileUuids: List<UUID>,
    ) = s3Service.deleteFilesByUuid(fileUuids)
}
