package com.grimsgaards.kalneslopene.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.filter.OncePerRequestFilter

/**
 * The session keeps the authorities the user had at login. Re-checking the users table on every
 * request makes bans and role changes take effect immediately instead of when the session expires.
 */
class SessionUserRefreshFilter(
    private val userRepository: UserRepository,
    private val securityContextRepository: SecurityContextRepository,
) : OncePerRequestFilter() {
    private val roleNames = UserRole.entries.map { it.name }.toSet()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authentication = SecurityContextHolder.getContext().authentication
        val principal = authentication?.principal as? UserDetails
        if (authentication != null && principal != null) {
            val user = userRepository.findByUsername(principal.username)
            if (user == null || user.banned) {
                request.getSession(false)?.invalidate()
                SecurityContextHolder.clearContext()
            } else if (currentRoles(authentication) != user.roles.map { it.name }.toSet()) {
                refreshRoles(authentication, principal, user.roles, request, response)
            }
        }
        filterChain.doFilter(request, response)
    }

    private fun refreshRoles(
        authentication: Authentication,
        principal: UserDetails,
        roles: Set<UserRole>,
        request: HttpServletRequest,
        response: HttpServletResponse,
    ) {
        // Keeps non-role authorities such as Spring Security 7's FACTOR_PASSWORD
        val otherAuthorities = authentication.authorities.filter { it.authority !in roleNames }
        val authorities = otherAuthorities + roles.map { SimpleGrantedAuthority(it.name) }
        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = UsernamePasswordAuthenticationToken.authenticated(principal, null, authorities)
        SecurityContextHolder.setContext(context)
        securityContextRepository.saveContext(context, request, response)
    }

    private fun currentRoles(authentication: Authentication): Set<String> =
        authentication.authorities
            .mapNotNull { it.authority }
            .filter { it in roleNames }
            .toSet()
}
