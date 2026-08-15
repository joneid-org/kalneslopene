package com.grimsgaards.kalneslopene.security

import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime
import java.util.UUID

private const val INVITE_VALID_HOURS = 24L

@Service
class UserService(
    val userRepository: UserRepository,
    val inviteRepository: InviteRepository,
    val passwordEncoder: PasswordEncoder,
    val authenticatedUserProvider: AuthenticatedUserProvider,
) {
    fun getUsers(): List<UserDto> = userRepository.findAll().sortedBy { it.username }.map { it.toDto() }

    fun createInvite(roles: Set<UserRole>): InviteDto =
        inviteRepository
            .save(
                InviteEntity(
                    roles = roles.toMutableSet(),
                    expiresAt = OffsetDateTime.now().plusHours(INVITE_VALID_HOURS),
                ),
            ).toDto()

    fun registerWithInvite(
        token: UUID,
        username: String,
        password: String,
    ): LoginResponse {
        if (username.isBlank() || password.isBlank()) {
            reject(HttpStatus.BAD_REQUEST, "Brukernavn og passord er påkrevd")
        }
        val invite =
            inviteRepository
                .findById(token)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Invitasjonen finnes ikke") }

        if (invite.usedAt != null) {
            reject(HttpStatus.GONE, "Invitasjonen er allerede brukt")
        }
        if (invite.expiresAt.isBefore(OffsetDateTime.now())) {
            reject(HttpStatus.GONE, "Invitasjonen er utløpt")
        }
        if (userRepository.findByUsername(username) != null) {
            reject(HttpStatus.CONFLICT, "Brukernavnet er allerede i bruk")
        }

        val user =
            userRepository.save(
                UserEntity(
                    username = username,
                    password =
                        passwordEncoder.encode(password)
                            ?: throw IllegalStateException("Password encoding returned null"),
                    roles = invite.roles.toMutableSet(),
                ),
            )
        inviteRepository.save(invite.apply { usedAt = OffsetDateTime.now() })

        return LoginResponse(username = user.username, roles = user.roles)
    }

    fun setRoles(
        uuid: UUID,
        roles: Set<UserRole>,
    ): UserDto {
        val user = findUser(uuid)
        if (isSelf(user) && !roles.contains(UserRole.ADMIN)) {
            reject(HttpStatus.CONFLICT, "Du kan ikke fjerne din egen administratorrolle")
        }
        return userRepository.save(user.apply { this.roles = roles.toMutableSet() }).toDto()
    }

    fun setBanned(
        uuid: UUID,
        banned: Boolean,
    ): UserDto {
        val user = findUser(uuid)
        if (isSelf(user) && banned) {
            reject(HttpStatus.CONFLICT, "Du kan ikke utestenge deg selv")
        }
        return userRepository.save(user.apply { this.banned = banned }).toDto()
    }

    private fun reject(
        status: HttpStatus,
        message: String,
    ): Nothing = throw ResponseStatusException(status, message)

    private fun findUser(uuid: UUID): UserEntity =
        userRepository
            .findById(uuid)
            .orElseThrow { NoSuchElementException("User with uuid $uuid not found") }

    /**
     * Guarding only against acting on yourself is enough to keep at least one admin alive: whoever
     * strips the second-to-last admin is themselves an admin, and cannot strip themselves.
     */
    private fun isSelf(user: UserEntity): Boolean = authenticatedUserProvider.authenticatedUser()?.uuid == user.uuid
}
