package com.grimsgaards.kalneslopene.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

data class LoginRequest(
    val username: String,
    val password: String,
)

data class LoginResponse(
    val username: String,
    val roles: Set<UserRole>,
)

data class SetupRequest(
    val username: String,
    val password: String,
)

data class RegisterRequest(
    val username: String,
    val password: String,
)

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userService: UserService,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val securityContextRepository: SecurityContextRepository,
    private val authenticatedUserProvider: AuthenticatedUserProvider,
) {
    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
        httpRequest: HttpServletRequest,
        httpResponse: HttpServletResponse,
    ): LoginResponse {
        val authentication =
            try {
                authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(request.username, request.password),
                )
            } catch (_: DisabledException) {
                throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Brukeren er utestengt")
            } catch (_: AuthenticationException) {
                throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ugyldig brukernavn eller passord")
            }

        establishSession(authentication, httpRequest, httpResponse)
        return LoginResponse(
            username = authentication.name,
            // Spring Security 7 mixes in factor authorities such as FACTOR_PASSWORD, so match
            // against the known roles rather than assuming every authority is one.
            roles =
                authentication.authorities.mapNotNullTo(mutableSetOf()) { granted ->
                    UserRole.entries.find { it.name == granted.authority }
                },
        )
    }

    /** Redeems an invite link. Public by necessity — the invitee has no account yet. */
    @PostMapping("/register/{token}")
    fun register(
        @PathVariable token: UUID,
        @RequestBody request: RegisterRequest,
        httpRequest: HttpServletRequest,
        httpResponse: HttpServletResponse,
    ): LoginResponse {
        val response = userService.registerWithInvite(token, request.username, request.password)
        establishSession(authenticationFor(response.username), httpRequest, httpResponse)
        return response
    }

    /** The SPA cannot read the httpOnly session cookie, so it asks here who it is on every page load. */
    @GetMapping("/me")
    fun me(): LoginResponse {
        val user =
            authenticatedUserProvider.authenticatedUser()
                ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ikke innlogget")
        return LoginResponse(username = user.username, roles = user.roles)
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun logout(httpRequest: HttpServletRequest) {
        httpRequest.getSession(false)?.invalidate()
        SecurityContextHolder.clearContext()
    }

    /** Returns true when no users exist — used by frontend to show first-time setup */
    @GetMapping("/setup/needed")
    fun isSetupNeeded(): Map<String, Boolean> = mapOf("needed" to (userRepository.count() == 0L))

    /** Creates the first admin user. Only allowed when the user table is empty. */
    @PostMapping("/setup")
    fun setup(
        @RequestBody request: SetupRequest,
        httpRequest: HttpServletRequest,
        httpResponse: HttpServletResponse,
    ): LoginResponse {
        if (userRepository.count() > 0) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Oppsett er allerede gjennomført")
        }
        if (request.username.isBlank() || request.password.isBlank()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Brukernavn og passord er påkrevd")
        }
        val user =
            UserEntity(
                username = request.username,
                password =
                    passwordEncoder.encode(request.password)
                        ?: throw IllegalStateException("Password encoding returned null"),
                roles = mutableSetOf(UserRole.ADMIN),
            )
        userRepository.save(user)
        establishSession(authenticationFor(user.username), httpRequest, httpResponse)
        return LoginResponse(username = user.username, roles = user.roles)
    }

    /**
     * Builds an authenticated token for a user whose identity has just been established by other means
     * (created during setup, or redeemed via invite), avoiding a redundant password verification.
     */
    private fun authenticationFor(username: String): Authentication {
        val userDetails = userDetailsService.loadUserByUsername(username)
        return UsernamePasswordAuthenticationToken.authenticated(userDetails, null, userDetails.authorities)
    }

    /**
     * Authenticating inside a controller skips the filter that would normally rotate the session id and
     * persist the context, so both are done by hand here.
     */
    private fun establishSession(
        authentication: Authentication,
        request: HttpServletRequest,
        response: HttpServletResponse,
    ) {
        if (request.getSession(false) == null) {
            request.getSession(true)
        } else {
            request.changeSessionId()
        }
        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = authentication
        SecurityContextHolder.setContext(context)
        securityContextRepository.saveContext(context, request, response)
    }
}
