package com.grimsgaards.kalneslopene.clientconfig

import com.grimsgaards.kalneslopene.s3.S3Service
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
