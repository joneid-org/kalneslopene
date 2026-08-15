package com.grimsgaards.kalneslopene.security

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

data class InviteRequest(
    val roles: Set<UserRole>,
)

data class RolesRequest(
    val roles: Set<UserRole>,
)

data class BannedRequest(
    val banned: Boolean,
)

@RestController
@RequestMapping("/api/users")
class UserController(
    val userService: UserService,
) {
    @GetMapping
    fun getUsers(): List<UserDto> = userService.getUsers()

    @PostMapping("/invites")
    fun createInvite(
        @RequestBody request: InviteRequest,
    ): InviteDto = userService.createInvite(request.roles)

    @PatchMapping("/{uuid}/roles")
    fun setRoles(
        @PathVariable uuid: UUID,
        @RequestBody request: RolesRequest,
    ): UserDto = userService.setRoles(uuid, request.roles)

    @PatchMapping("/{uuid}/banned")
    fun setBanned(
        @PathVariable uuid: UUID,
        @RequestBody request: BannedRequest,
    ): UserDto = userService.setBanned(uuid, request.banned)
}
