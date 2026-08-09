package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.debug.DebugController
import com.grimsgaards.kalneslopene.debug.DebugTestException
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

@WebMvcTest(DebugController::class)
@AutoConfigureMockMvc(addFilters = false)
class DebugControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Nested
    inner class TriggerError {
        @Test
        fun `logs an error without throwing when type is log`() {
            mockMvc
                .post("/api/debug/error?type=log")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.triggered") { value("log") }
                }
        }

        @Test
        fun `throws an unhandled exception by default`() {
            val thrown =
                assertFailsWith<Throwable> {
                    mockMvc.post("/api/debug/error")
                }
            assertTrue(generateSequence<Throwable>(thrown) { it.cause }.any { it is DebugTestException })
        }
    }
}
