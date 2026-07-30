package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.runner.RunnerRepository
import com.grimsgaards.kalneslopene.runner.RunnerService
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.doThrow
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@MockitoSettings(strictness = Strictness.LENIENT)
class RunnerServiceTest {
    @Mock
    lateinit var runnerRepository: RunnerRepository

    private lateinit var service: RunnerService

    @BeforeEach
    fun setUp() {
        service = RunnerService(runnerRepository)
    }

    @Test
    fun `deleteRunner uses bulk delete instead of entity delete`() {
        val uuid = UUID.randomUUID()

        service.deleteRunner(uuid)

        // deleteById would trigger a delete against the read-only runner_stats view via
        // the entity's @SecondaryTable mapping and fail; deleteByUuid is a bulk query
        // that only touches the runner table.
        verify(runnerRepository).deleteByUuid(uuid)
        verify(runnerRepository, never()).deleteById(uuid)
    }

    @Test
    fun `deleteRunner throws conflict when runner still has races`() {
        val uuid = UUID.randomUUID()
        doThrow(DataIntegrityViolationException("fk violation")).`when`(runnerRepository).deleteByUuid(uuid)

        assertThatThrownBy { service.deleteRunner(uuid) }
            .isInstanceOf(ResponseStatusException::class.java)
            .hasFieldOrPropertyWithValue("statusCode", HttpStatus.CONFLICT)
    }
}
