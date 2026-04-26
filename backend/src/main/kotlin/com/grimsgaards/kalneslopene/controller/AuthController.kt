package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.entities.UserEntity
import com.grimsgaards.kalneslopene.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val username: String, val roles: List<String>)
data class SetupRequest(val username: String, val password: String)

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): LoginResponse {
        val user = userRepository.findByUsername(request.username)
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ugyldig brukernavn eller passord")

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ugyldig brukernavn eller passord")
        }

        val roles = user.roles.split(",").map { it.trim() }
        return LoginResponse(username = user.username, roles = roles)
    }

    /** Returns true when no users exist — used by frontend to show first-time setup */
    @GetMapping("/setup/needed")
    fun isSetupNeeded(): Map<String, Boolean> {
        return mapOf("needed" to (userRepository.count() == 0L))
    }

    /** Creates the first admin user. Only allowed when the user table is empty. */
    @PostMapping("/setup")
    fun setup(@RequestBody request: SetupRequest): LoginResponse {
        if (userRepository.count() > 0) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Oppsett er allerede gjennomført")
        }
        if (request.username.isBlank() || request.password.isBlank()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Brukernavn og passord er påkrevd")
        }
        val user = UserEntity(
            username = request.username,
            password = passwordEncoder.encode(request.password)
                ?: throw IllegalStateException("Password encoding returned null"),
            roles = "ROLE_ADMIN",
        )
        userRepository.save(user)
        return LoginResponse(username = user.username, roles = listOf("ROLE_ADMIN"))
    }
}

