package com.grimsgaards.kalneslopene.config

import org.springframework.context.annotation.Configuration
import org.springframework.http.CacheControl
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.util.concurrent.TimeUnit

const val DAYS_IN_YEAR = 365L

@Configuration
class StaticResourceConfig : WebMvcConfigurer {
    // Vite content-hashes everything under /assets/, so it's safe to cache forever.
    // index.html is intentionally left on the default (short) cache so deploys pick up new hashes.
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/assets/**")
            .addResourceLocations("classpath:/static/assets/")
            .setCacheControl(CacheControl.maxAge(DAYS_IN_YEAR, TimeUnit.DAYS).cachePublic().immutable())
    }
}
