package com.grimsgaards.kalneslopene.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.security.web.csrf.CookieCsrfTokenRepository

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf {
                // spa() sets the XSRF-TOKEN cookie repository and the plain/XOR hybrid request handler,
                // which also renders the token eagerly. Overriding the repository afterwards keeps that
                // handler while adding SameSite=Strict.
                it.spa()
                it.csrfTokenRepository(
                    CookieCsrfTokenRepository().apply {
                        setCookieCustomizer { cookie -> cookie.httpOnly(false).sameSite("Strict") }
                    },
                )
            }.authorizeHttpRequests { auth ->
                auth
                    // Must precede the blanket GET rule below, or the user list would be world-readable
                    .requestMatchers(HttpMethod.GET, "/api/users/**")
                    .hasAuthority(UserRole.ADMIN.toString())
                    .requestMatchers(HttpMethod.GET, "/api/s3/presigned-url")
                    .hasAnyAuthority(UserRole.ADMIN.toString(), UserRole.EDITOR.toString())
                    // Also before the blanket GET rule — this is how the SPA discovers whether its
                    // session cookie is still valid, so it must be able to answer 401.
                    .requestMatchers(HttpMethod.GET, "/api/auth/me")
                    .hasAnyAuthority(UserRole.ADMIN.toString(), UserRole.EDITOR.toString())
                    .requestMatchers(HttpMethod.GET, "/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/setup")
                    .permitAll()
                    // Logging out without a session is a no-op, not an error
                    .requestMatchers(HttpMethod.POST, "/api/auth/logout")
                    .permitAll()
                    // Redeeming an invite, not creating one — creation is POST /api/users/invites below
                    .requestMatchers(HttpMethod.POST, "/api/auth/register/*")
                    .permitAll()
                    .requestMatchers("/api/users/**")
                    .hasAuthority(UserRole.ADMIN.toString())
                    .anyRequest()
                    .hasAnyAuthority(UserRole.ADMIN.toString(), UserRole.EDITOR.toString())
            }.exceptionHandling {
                // Without an explicit entry point the default is Http403ForbiddenEntryPoint, and the
                // frontend distinguishes "logged out" from "forbidden" by the 401.
                it.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            }
        return http.build()
    }

    @Bean
    fun securityContextRepository(): SecurityContextRepository = HttpSessionSecurityContextRepository()

    @Bean
    fun authenticationManager(
        userDetailsService: UserDetailsService,
        passwordEncoder: PasswordEncoder,
    ): AuthenticationManager =
        ProviderManager(
            DaoAuthenticationProvider(userDetailsService).apply { setPasswordEncoder(passwordEncoder) },
        )

    @Bean
    fun userDetailsService(userRepository: UserRepository): UserDetailsService =
        UserDetailsService { username ->
            val user =
                userRepository.findByUsername(username)
                    ?: throw UsernameNotFoundException("Bruker ikke funnet: $username")
            val authorities = user.roles.map { SimpleGrantedAuthority(it.toString()) }
            User
                .builder()
                .username(user.username)
                .password(user.password)
                .authorities(authorities)
                .disabled(user.banned)
                .build()
        }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}
