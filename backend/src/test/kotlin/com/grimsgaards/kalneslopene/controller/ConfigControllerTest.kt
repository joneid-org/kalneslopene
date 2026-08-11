package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.clientconfig.ConfigController
import com.grimsgaards.kalneslopene.s3.S3Service
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.stubbing.OngoingStubbing
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@WebMvcTest(ConfigController::class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(
    properties = [
        "client-config.sentry-dsn=https://key@glitchtip.example/2",
        "sentry.environment=test",
        "sentry.release=abc1234",
    ],
)
class ConfigControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockitoBean
    lateinit var s3Service: S3Service

    @Nested
    inner class GetConfig {
        @Test
        fun `returns s3 base url and error tracking config`() {
            whenever(s3Service.getPublicBaseUrl()).thenReturn("https://s3.example/bucket")

            mockMvc
                .get("/api/config")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.s3BaseUrl") { value("https://s3.example/bucket") }
                    jsonPath("$.sentryDsn") { value("https://key@glitchtip.example/2") }
                    jsonPath("$.environment") { value("test") }
                    jsonPath("$.release") { value("abc1234") }
                }
        }
    }

    @Nested
    @TestPropertySource(properties = ["client-config.sentry-dsn=", "sentry.release="])
    inner class GetConfigWithoutSentry {
        @Test
        fun `reports blank dsn and release as null`() {
            whenever(s3Service.getPublicBaseUrl()).thenReturn("https://s3.example/bucket")

            mockMvc
                .get("/api/config")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.sentryDsn") { value(null) }
                    jsonPath("$.release") { value(null) }
                }
        }
    }

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
