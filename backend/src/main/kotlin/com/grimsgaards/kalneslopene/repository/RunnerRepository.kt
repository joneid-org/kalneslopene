package com.grimsgaards.kalneslopene.repository

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RunnerRepository : JpaRepository<RunnerEntity, UUID> {
    fun findByNameContainsIgnoreCase(name: String): List<RunnerEntity>

    fun findByIsVerified(isVerified: Boolean): List<RunnerEntity>

    fun findByNameContainsIgnoreCaseAndIsVerified(
        name: String,
        isVerified: Boolean,
    ): List<RunnerEntity>

    @Query(
        """
        SELECT COUNT(DISTINCT rr.id.runnerUuid) FROM RaceRunnerEntity rr
        WHERE rr.race.isPublished = true
    """,
    )
    fun countRunnersWithAtLeastOneRace(): Long

    fun findFirstByGenderAndHistoricPersonalRecordIsNotNullOrderByHistoricPersonalRecordAsc(gender: Gender): RunnerEntity?

    @Modifying
    @NativeQuery("delete from runner r where r.uuid = :uuid")
    fun deleteByUuid(uuid: UUID)
}
