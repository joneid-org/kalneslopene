package com.grimsgaards.kalneslopene.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthenticatedUserProvider(
    private val userRepository: UserRepository,
) {
    // ponytail: reloads the user per call; cache on the principal if this ever lands on a hot path
    fun authenticatedUser(): UserDto? {
        val authentication = SecurityContextHolder.getContext().authentication
        val principal = authentication?.principal as? UserDetails ?: return null
        return userRepository.findByUsername(principal.username)?.toDto()
    }

    fun isAdmin(): Boolean = authenticatedUser()?.roles?.contains(UserRole.ADMIN) ?: false
}

data class UserDto(
    val uuid: UUID,
    val username: String,
    val roles: Set<UserRole>,
    val banned: Boolean,
)
