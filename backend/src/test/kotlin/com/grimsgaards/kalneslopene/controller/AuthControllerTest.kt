package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.security.AuthController
import com.grimsgaards.kalneslopene.security.AuthenticatedUserProvider
import com.grimsgaards.kalneslopene.security.SecurityConfig
import com.grimsgaards.kalneslopene.security.UserDto
import com.grimsgaards.kalneslopene.security.UserEntity
import com.grimsgaards.kalneslopene.security.UserRepository
import com.grimsgaards.kalneslopene.security.UserRole
import com.grimsgaards.kalneslopene.security.UserService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.stubbing.OngoingStubbing
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.UUID

/**
 * Deliberately runs with the security filters enabled (no `addFilters = false`) — session
 * establishment and CSRF rejection only exist inside the filter chain.
 */
@WebMvcTest(AuthController::class)
@Import(SecurityConfig::class)
class AuthControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockitoBean
    lateinit var userRepository: UserRepository

    @MockitoBean
    lateinit var userService: UserService

    @MockitoBean
    lateinit var authenticatedUserProvider: AuthenticatedUserProvider

    private val rawPassword = "hemmelig"

    private fun existingUser(banned: Boolean = false) =
        UserEntity(
            username = "kari",
            password = BCryptPasswordEncoder().encode(rawPassword) ?: error("encoding failed"),
            roles = mutableSetOf(UserRole.ADMIN),
            banned = banned,
        )

    private fun loginBody(password: String = rawPassword) = """{"username":"kari","password":"$password"}"""

    @Nested
    inner class Login {
        @Test
        fun `stores an authenticated security context in the session`() {
            whenever(userRepository.findByUsername("kari")).thenReturn(existingUser())

            val result =
                mockMvc
                    .post("/api/auth/login") {
                        with(csrf())
                        contentType = MediaType.APPLICATION_JSON
                        content = loginBody()
                    }.andExpect {
                        status { isOk() }
                        jsonPath("$.username") { value("kari") }
                        jsonPath("$.roles[0]") { value("ADMIN") }
                    }.andReturn()

            val session = result.request.getSession(false)
            assertThat(session).isNotNull()
            assertThat(session?.getAttribute(SPRING_SECURITY_CONTEXT_KEY)).isNotNull()
        }

        @Test
        fun `rejects a wrong password without creating a security context`() {
            whenever(userRepository.findByUsername("kari")).thenReturn(existingUser())

            val result =
                mockMvc
                    .post("/api/auth/login") {
                        with(csrf())
                        contentType = MediaType.APPLICATION_JSON
                        content = loginBody(password = "feil")
                    }.andExpect { status { isUnauthorized() } }
                    .andReturn()

            assertThat(result.request.getSession(false)?.getAttribute(SPRING_SECURITY_CONTEXT_KEY)).isNull()
        }

        @Test
        fun `rejects a banned user`() {
            whenever(userRepository.findByUsername("kari")).thenReturn(existingUser(banned = true))

            mockMvc
                .post("/api/auth/login") {
                    with(csrf())
                    contentType = MediaType.APPLICATION_JSON
                    content = loginBody()
                }.andExpect { status { isUnauthorized() } }
        }

        @Test
        fun `is rejected when the csrf token is missing`() {
            whenever(userRepository.findByUsername("kari")).thenReturn(existingUser())

            mockMvc
                .post("/api/auth/login") {
                    contentType = MediaType.APPLICATION_JSON
                    content = loginBody()
                }.andExpect { status { isForbidden() } }
        }
    }

    @Nested
    inner class Me {
        @Test
        fun `answers 401 when there is no session`() {
            mockMvc.get("/api/auth/me").andExpect { status { isUnauthorized() } }
        }

        @Test
        @WithMockUser(authorities = ["ADMIN"])
        fun `returns the current user when authenticated`() {
            whenever(authenticatedUserProvider.authenticatedUser())
                .thenReturn(UserDto(UUID.randomUUID(), "kari", setOf(UserRole.ADMIN), banned = false))

            mockMvc.get("/api/auth/me").andExpect {
                status { isOk() }
                jsonPath("$.username") { value("kari") }
                jsonPath("$.roles[0]") { value("ADMIN") }
            }
        }
    }

    @Nested
    inner class Logout {
        @Test
        @WithMockUser(authorities = ["ADMIN"])
        fun `invalidates the session`() {
            val result =
                mockMvc
                    .post("/api/auth/logout") { with(csrf()) }
                    .andExpect { status { isNoContent() } }
                    .andReturn()

            assertThat(result.request.getSession(false)).isNull()
        }
    }

    @Nested
    inner class ProtectedEndpoints {
        @Test
        fun `answer 401 rather than 403 when unauthenticated`() {
            mockMvc.get("/api/users").andExpect { status { isUnauthorized() } }
        }
    }

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
