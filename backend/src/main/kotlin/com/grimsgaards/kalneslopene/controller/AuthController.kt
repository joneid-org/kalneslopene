package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val username: String, val roles: List<String>)

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
}

