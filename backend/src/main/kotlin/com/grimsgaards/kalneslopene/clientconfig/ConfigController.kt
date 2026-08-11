package com.grimsgaards.kalneslopene.clientconfig

import com.grimsgaards.kalneslopene.s3.S3Service
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/config")
class ConfigController(
    private val s3Service: S3Service,
    @Value("\${client-config.sentry-dsn:}")
    private val sentryDsn: String,
    @Value("\${sentry.environment:local}")
    private val environment: String,
    @Value("\${sentry.release:}")
    private val release: String,
) {
    @GetMapping
    fun getConfig(): ClientConfigDto =
        ClientConfigDto(
            s3BaseUrl = s3Service.getPublicBaseUrl(),
            sentryDsn = sentryDsn.ifBlank { null },
            environment = environment,
            release = release.ifBlank { null },
        )
}
