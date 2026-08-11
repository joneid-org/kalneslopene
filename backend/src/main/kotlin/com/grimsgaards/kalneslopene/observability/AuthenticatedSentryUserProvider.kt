package com.grimsgaards.kalneslopene.observability

import com.grimsgaards.kalneslopene.security.AuthenticatedUserProvider
import io.sentry.protocol.User
import io.sentry.spring7.SentryUserProvider
import org.springframework.stereotype.Component

// Sentry's own SpringSecuritySentryUserProvider only reports a user when send-default-pii is on,
// which would also attach IP and request data. This reports the username and nothing else.
@Component
class AuthenticatedSentryUserProvider(
    private val authenticatedUserProvider: AuthenticatedUserProvider,
) : SentryUserProvider {
    override fun provideUser(): User? =
        authenticatedUserProvider.authenticatedUser()?.let { authenticated ->
            User().apply {
                username = authenticated.username
                data = mapOf("roles" to authenticated.roles.joinToString(",") { it.name })
            }
        }
}
