package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.ClientConfigDto
import com.grimsgaards.kalneslopene.service.S3Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/config")
class ConfigController(
    private val s3Service: S3Service,
) {
    @GetMapping
    fun getConfig(): ClientConfigDto = ClientConfigDto(s3BaseUrl = s3Service.getPublicBaseUrl())
}
