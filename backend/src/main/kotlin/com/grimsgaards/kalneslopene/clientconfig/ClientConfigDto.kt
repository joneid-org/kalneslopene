package com.grimsgaards.kalneslopene.clientconfig

data class ClientConfigDto(
    val s3BaseUrl: String,
    val sentryDsn: String?,
    val environment: String,
    val release: String?,
)
