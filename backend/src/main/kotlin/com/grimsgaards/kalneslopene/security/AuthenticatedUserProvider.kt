package com.grimsgaards.kalneslopene.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class AuthenticatedUserProvider {
    fun authenticatedUser(): UserDto? {
        val authentication = SecurityContextHolder.getContext().authentication
        val principal = authentication?.principal as? UserDetails ?: return null
        return UserDto(
            username = principal.username,
            roles = principal.authorities.map { UserRole.valueOf(it.authority!!) }.toSet(),
        )
    }

    fun isAdmin(): Boolean = authenticatedUser()?.roles?.contains(UserRole.ADMIN) ?: false
}

data class UserDto(
    val username: String,
    val roles: Set<UserRole>,
)
