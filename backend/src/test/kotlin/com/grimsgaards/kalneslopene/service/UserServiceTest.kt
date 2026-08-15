package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.security.AuthenticatedUserProvider
import com.grimsgaards.kalneslopene.security.InviteEntity
import com.grimsgaards.kalneslopene.security.InviteRepository
import com.grimsgaards.kalneslopene.security.UserDto
import com.grimsgaards.kalneslopene.security.UserEntity
import com.grimsgaards.kalneslopene.security.UserRepository
import com.grimsgaards.kalneslopene.security.UserRole
import com.grimsgaards.kalneslopene.security.UserService
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.Mockito.anyString
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserServiceTest {
    @Mock
    lateinit var userRepository: UserRepository

    @Mock
    lateinit var inviteRepository: InviteRepository

    @Mock
    lateinit var passwordEncoder: PasswordEncoder

    @Mock
    lateinit var authenticatedUserProvider: AuthenticatedUserProvider

    private lateinit var service: UserService

    @BeforeEach
    fun setUp() {
        whenever(userRepository.save(any())).thenAnswer { it.getArgument(0) }
        whenever(inviteRepository.save(any())).thenAnswer { it.getArgument(0) }
        whenever(passwordEncoder.encode(anyString())).thenAnswer { "hashed-${it.getArgument<String>(0)}" }
        whenever(userRepository.findByUsername(anyString())).thenReturn(null)

        service = UserService(userRepository, inviteRepository, passwordEncoder, authenticatedUserProvider)
    }

    private fun user(
        username: String = "eirik",
        roles: Set<UserRole> = setOf(UserRole.ADMIN),
        banned: Boolean = false,
    ) = UserEntity(username = username, password = "hashed", roles = roles.toMutableSet(), banned = banned)

    private fun signedInAs(user: UserEntity) {
        whenever(authenticatedUserProvider.authenticatedUser())
            .thenReturn(UserDto(user.uuid, user.username, user.roles, user.banned))
    }

    private fun invite(
        roles: Set<UserRole> = setOf(UserRole.EDITOR),
        expiresAt: OffsetDateTime = OffsetDateTime.now().plusHours(24),
        usedAt: OffsetDateTime? = null,
    ) = InviteEntity(roles = roles.toMutableSet(), expiresAt = expiresAt, usedAt = usedAt)

    @Nested
    inner class CreateInvite {
        @Test
        fun `expires 24 hours out and carries the requested roles`() {
            val invite = service.createInvite(setOf(UserRole.EDITOR))

            assertThat(invite.roles).containsExactly(UserRole.EDITOR)
            assertThat(invite.expiresAt).isBetween(
                OffsetDateTime.now().plusHours(23),
                OffsetDateTime.now().plusHours(25),
            )
        }
    }

    @Nested
    inner class RegisterWithInvite {
        @Test
        fun `creates the user with the invite's roles and marks the invite used`() {
            val invite = invite(roles = setOf(UserRole.EDITOR))
            whenever(inviteRepository.findById(invite.uuid)).thenReturn(Optional.of(invite))

            val response = service.registerWithInvite(invite.uuid, "nybruker", "hemmelig")

            assertThat(response.username).isEqualTo("nybruker")
            assertThat(response.roles).containsExactly(UserRole.EDITOR)
            assertThat(invite.usedAt).isNotNull()
        }

        @Test
        fun `rejects an expired invite`() {
            val invite = invite(expiresAt = OffsetDateTime.now().minusMinutes(1))
            whenever(inviteRepository.findById(invite.uuid)).thenReturn(Optional.of(invite))

            assertThatThrownBy { service.registerWithInvite(invite.uuid, "nybruker", "hemmelig") }
                .isInstanceOf(ResponseStatusException::class.java)
                .hasMessageContaining("utløpt")

            verify(userRepository, never()).save(any())
        }

        @Test
        fun `rejects an invite that has already been used`() {
            val invite = invite(usedAt = OffsetDateTime.now().minusHours(1))
            whenever(inviteRepository.findById(invite.uuid)).thenReturn(Optional.of(invite))

            assertThatThrownBy { service.registerWithInvite(invite.uuid, "nybruker", "hemmelig") }
                .isInstanceOf(ResponseStatusException::class.java)
                .hasMessageContaining("allerede brukt")

            verify(userRepository, never()).save(any())
        }

        @Test
        fun `rejects an unknown token`() {
            val token = UUID.randomUUID()
            whenever(inviteRepository.findById(token)).thenReturn(Optional.empty())

            assertThatThrownBy { service.registerWithInvite(token, "nybruker", "hemmelig") }
                .isInstanceOf(ResponseStatusException::class.java)
        }

        @Test
        fun `rejects a username that is already taken`() {
            val invite = invite()
            whenever(inviteRepository.findById(invite.uuid)).thenReturn(Optional.of(invite))
            whenever(userRepository.findByUsername("nybruker")).thenReturn(user(username = "nybruker"))

            assertThatThrownBy { service.registerWithInvite(invite.uuid, "nybruker", "hemmelig") }
                .isInstanceOf(ResponseStatusException::class.java)
                .hasMessageContaining("allerede i bruk")

            assertThat(invite.usedAt).isNull()
        }
    }

    @Nested
    inner class SetRoles {
        @Test
        fun `updates roles on another user`() {
            val target = user(username = "kollega", roles = setOf(UserRole.EDITOR))
            whenever(userRepository.findById(target.uuid)).thenReturn(Optional.of(target))
            signedInAs(user())

            val updated = service.setRoles(target.uuid, setOf(UserRole.ADMIN, UserRole.EDITOR))

            assertThat(updated.roles).containsExactlyInAnyOrder(UserRole.ADMIN, UserRole.EDITOR)
        }

        @Test
        fun `refuses to remove your own admin role`() {
            val me = user()
            whenever(userRepository.findById(me.uuid)).thenReturn(Optional.of(me))
            signedInAs(me)

            assertThatThrownBy { service.setRoles(me.uuid, setOf(UserRole.EDITOR)) }
                .isInstanceOf(ResponseStatusException::class.java)
                .hasMessageContaining("egen administratorrolle")

            assertThat(me.roles).containsExactly(UserRole.ADMIN)
        }
    }

    @Nested
    inner class SetBanned {
        @Test
        fun `bans another user without deleting them`() {
            val target = user(username = "kollega", roles = setOf(UserRole.EDITOR))
            whenever(userRepository.findById(target.uuid)).thenReturn(Optional.of(target))
            signedInAs(user())

            val updated = service.setBanned(target.uuid, true)

            assertThat(updated.banned).isTrue()
            verify(userRepository, never()).delete(any())
        }

        @Test
        fun `refuses to ban yourself`() {
            val me = user()
            whenever(userRepository.findById(me.uuid)).thenReturn(Optional.of(me))
            signedInAs(me)

            assertThatThrownBy { service.setBanned(me.uuid, true) }
                .isInstanceOf(ResponseStatusException::class.java)
                .hasMessageContaining("utestenge deg selv")

            assertThat(me.banned).isFalse()
        }

        @Test
        fun `lets you unban yourself-adjacent users`() {
            val target = user(username = "kollega", banned = true)
            whenever(userRepository.findById(target.uuid)).thenReturn(Optional.of(target))
            signedInAs(user())

            assertThat(service.setBanned(target.uuid, false).banned).isFalse()
        }
    }

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
