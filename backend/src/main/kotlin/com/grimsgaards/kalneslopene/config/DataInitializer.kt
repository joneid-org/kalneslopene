package com.grimsgaards.kalneslopene.config

import com.grimsgaards.kalneslopene.model.entities.UserEntity
import com.grimsgaards.kalneslopene.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) : ApplicationRunner {

    private val logger = LoggerFactory.getLogger(DataInitializer::class.java)

    override fun run(args: ApplicationArguments) {
        if (userRepository.count() == 0L) {
            val username = System.getenv("INITIAL_USER")
            val rawPassword = System.getenv("INITIAL_PASSWORD")

            if (username.isNullOrBlank() || rawPassword.isNullOrBlank()) {
                logger.warn("User table is empty but INITIAL_USER or INITIAL_PASSWORD env vars are not set. Skipping initial user creation.")
                return
            }

            val encodedPassword = passwordEncoder.encode(rawPassword)
                ?: throw IllegalStateException("Password encoding returned null")
            val user = UserEntity(
                username = username,
                password = encodedPassword,
                roles = "ROLE_ADMIN"
            )
            userRepository.save(user)
            logger.info("Initial admin user '$username' created.")
        }
    }
}

