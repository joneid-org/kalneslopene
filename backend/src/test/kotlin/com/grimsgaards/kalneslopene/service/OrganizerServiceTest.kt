package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.organizer.OrganizerEntity
import com.grimsgaards.kalneslopene.organizer.OrganizerInput
import com.grimsgaards.kalneslopene.organizer.OrganizerRepository
import com.grimsgaards.kalneslopene.organizer.OrganizerService
import com.grimsgaards.kalneslopene.organizer.ReorderOrganizerInput
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.any
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness
import org.mockito.stubbing.OngoingStubbing
import java.util.UUID

@MockitoSettings(strictness = Strictness.LENIENT)
class OrganizerServiceTest {
    @Mock
    lateinit var organizerRepository: OrganizerRepository

    @Nested
    inner class GetAllOrganizers {
        @Test
        fun `reads through the order index sorted finder`() {
            val organizers = listOf(organizer("Turid", 1.0), organizer("Emilie", 2.0))
            whenever(organizerRepository.findAllByOrderByOrderIndexAsc()).thenReturn(organizers)

            val result = service().getAllOrganizers()

            assertThat(result.map { it.name }).containsExactly("Turid", "Emilie")
            verify(organizerRepository).findAllByOrderByOrderIndexAsc()
            verify(organizerRepository, never()).findAll()
        }
    }

    @Nested
    inner class CreateOrganizer {
        @Test
        fun `places a new organizer after the current last one`() {
            whenever(organizerRepository.findAll())
                .thenReturn(listOf(organizer("Emilie", 1.0), organizer("Magnus", 4.5)))

            assertThat(savedOrganizer().orderIndex).isEqualTo(5.5)
        }

        @Test
        fun `starts at one when there are no organizers yet`() {
            whenever(organizerRepository.findAll()).thenReturn(emptyList())

            assertThat(savedOrganizer().orderIndex).isEqualTo(1.0)
        }

        private fun savedOrganizer(): OrganizerEntity {
            whenever(organizerRepository.save(any(OrganizerEntity::class.java))).thenAnswer { it.getArgument(0) }
            service().createOrganizer(input("Astrid"))

            val captor = ArgumentCaptor.forClass(OrganizerEntity::class.java)
            verify(organizerRepository).save(captor.capture() ?: organizer("fallback", 0.0))
            return captor.value
        }
    }

    @Nested
    inner class ReorderOrganizer {
        @Test
        fun `midpoints between the two neighbours when moved into the middle`() {
            val (first, second, third) = threeOrganizers()

            val result =
                service().reorderOrganizer(
                    ReorderOrganizerInput(organizerUuid = first.uuid, beforeOrganizerUuid = third.uuid),
                )

            assertThat(first.orderIndex).isEqualTo(2.5)
            assertThat(result.map { it.name }).containsExactly("Second", "First", "Third")
        }

        @Test
        fun `subtracts one when dropped at the head`() {
            val (first, second, third) = threeOrganizers()

            service().reorderOrganizer(
                ReorderOrganizerInput(organizerUuid = third.uuid, beforeOrganizerUuid = first.uuid),
            )

            assertThat(third.orderIndex).isEqualTo(0.0)
            assertThat(listOf(first, second).map { it.orderIndex }).containsExactly(1.0, 2.0)
        }

        @Test
        fun `adds one when dropped at the tail`() {
            val (first, _, third) = threeOrganizers()

            service().reorderOrganizer(
                ReorderOrganizerInput(organizerUuid = first.uuid, afterOrganizerUuid = third.uuid),
            )

            assertThat(first.orderIndex).isEqualTo(4.0)
        }

        @Test
        fun `saves only the moved organizer`() {
            val (first, second, third) = threeOrganizers()

            service().reorderOrganizer(
                ReorderOrganizerInput(organizerUuid = first.uuid, afterOrganizerUuid = third.uuid),
            )

            verify(organizerRepository).save(first)
            verify(organizerRepository, never()).save(second)
            verify(organizerRepository, never()).save(third)
        }

        @Test
        fun `throws when the moved organizer does not exist`() {
            val (first, _, _) = threeOrganizers()

            assertThatThrownBy {
                service().reorderOrganizer(
                    ReorderOrganizerInput(organizerUuid = UUID.randomUUID(), beforeOrganizerUuid = first.uuid),
                )
            }.isInstanceOf(NoSuchElementException::class.java)
        }

        @Test
        fun `throws when the anchor organizer does not exist`() {
            val (first, _, _) = threeOrganizers()

            assertThatThrownBy {
                service().reorderOrganizer(
                    ReorderOrganizerInput(organizerUuid = first.uuid, beforeOrganizerUuid = UUID.randomUUID()),
                )
            }.isInstanceOf(IllegalArgumentException::class.java)
        }

        @Test
        fun `rejects an input without exactly one anchor`() {
            val uuid = UUID.randomUUID()

            assertThatThrownBy { ReorderOrganizerInput(organizerUuid = uuid) }
                .isInstanceOf(IllegalArgumentException::class.java)
            assertThatThrownBy {
                ReorderOrganizerInput(organizerUuid = uuid, beforeOrganizerUuid = uuid, afterOrganizerUuid = uuid)
            }.isInstanceOf(IllegalArgumentException::class.java)
        }
    }

    private fun threeOrganizers(): Triple<OrganizerEntity, OrganizerEntity, OrganizerEntity> {
        val first = organizer("First", 1.0)
        val second = organizer("Second", 2.0)
        val third = organizer("Third", 3.0)
        whenever(organizerRepository.findAllByOrderByOrderIndexAsc()).thenReturn(listOf(first, second, third))
        whenever(organizerRepository.save(any<OrganizerEntity>())).thenAnswer { it.getArgument(0) }
        return Triple(first, second, third)
    }

    private fun organizer(
        name: String,
        orderIndex: Double,
    ) = OrganizerEntity(
        name = name,
        responsibility = listOf("Leder"),
        initials = name.take(2).uppercase(),
        phone = null,
        email = null,
        contactperson = false,
        orderIndex = orderIndex,
    )

    private fun input(name: String) =
        OrganizerInput(
            name = name,
            responsibility = listOf("Leder"),
            initials = name.take(2).uppercase(),
            contactPerson = false,
        )

    private fun service() = OrganizerService(organizerRepository)

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
