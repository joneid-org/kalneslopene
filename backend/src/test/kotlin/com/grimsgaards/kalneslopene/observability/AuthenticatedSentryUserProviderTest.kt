package com.grimsgaards.kalneslopene.observability

import com.grimsgaards.kalneslopene.security.AuthenticatedUserProvider
import com.grimsgaards.kalneslopene.security.UserDto
import com.grimsgaards.kalneslopene.security.UserRole
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.stubbing.OngoingStubbing
import kotlin.test.assertEquals
import kotlin.test.assertNull

class AuthenticatedSentryUserProviderTest {
    private val authenticatedUserProvider = Mockito.mock(AuthenticatedUserProvider::class.java)
    private val provider = AuthenticatedSentryUserProvider(authenticatedUserProvider)

    @Nested
    inner class ProvideUser {
        @Test
        fun `reports the username and roles when logged in`() {
            whenever(authenticatedUserProvider.authenticatedUser())
                .thenReturn(UserDto(username = "eirik", roles = setOf(UserRole.ADMIN)))

            val user = provider.provideUser()

            assertEquals("eirik", user?.username)
            assertEquals("ADMIN", user?.data?.get("roles"))
        }

        @Test
        fun `never attaches email or ip address`() {
            whenever(authenticatedUserProvider.authenticatedUser())
                .thenReturn(UserDto(username = "eirik", roles = setOf(UserRole.ADMIN)))

            val user = provider.provideUser()

            assertNull(user?.email)
            assertNull(user?.ipAddress)
        }

        @Test
        fun `returns null for anonymous requests`() {
            whenever(authenticatedUserProvider.authenticatedUser()).thenReturn(null)

            assertNull(provider.provideUser())
        }
    }

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
