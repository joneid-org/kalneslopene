package com.grimsgaards.kalneslopene.debug

import com.grimsgaards.kalneslopene.common.logger
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

class DebugTestException(
    message: String,
) : RuntimeException(message)

// Smoke test for error tracking. POST-only, so SecurityConfig's anyRequest() rule gates it behind ADMIN.
@RestController
@RequestMapping("/api/debug")
class DebugController {
    private val logger = logger()

    @PostMapping("/error")
    fun triggerError(
        @RequestParam(defaultValue = "exception") type: String,
    ): Map<String, String> {
        if (type == "log") {
            logger.error("GlitchTip smoke test: error log triggered from /api/debug/error")
            return mapOf("triggered" to "log")
        }
        throw DebugTestException("GlitchTip smoke test: unhandled exception triggered from /api/debug/error")
    }
}
