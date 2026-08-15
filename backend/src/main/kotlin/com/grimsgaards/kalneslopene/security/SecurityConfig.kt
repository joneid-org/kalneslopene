package com.grimsgaards.kalneslopene.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    // Must precede the blanket GET rule below, or the user list would be world-readable
                    .requestMatchers(HttpMethod.GET, "/api/users/**")
                    .hasAuthority(UserRole.ADMIN.toString())
                    .requestMatchers(HttpMethod.GET, "/api/s3/presigned-url")
                    .hasAnyAuthority(UserRole.ADMIN.toString(), UserRole.EDITOR.toString())
                    .requestMatchers(HttpMethod.GET, "/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/setup")
                    .permitAll()
                    // Redeeming an invite, not creating one — creation is POST /api/users/invites below
                    .requestMatchers(HttpMethod.POST, "/api/auth/register/*")
                    .permitAll()
                    .requestMatchers("/api/users/**")
                    .hasAuthority(UserRole.ADMIN.toString())
                    .anyRequest()
                    .hasAnyAuthority(UserRole.ADMIN.toString(), UserRole.EDITOR.toString())
            }.httpBasic { }
        return http.build()
    }

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
