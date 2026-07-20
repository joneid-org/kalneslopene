package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceResultSummaryDto
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.entities.UserRole
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Suppress("TooManyFunctions")
@Service
class RaceService(
    val raceRepository: RaceRepository,
    val runnerRepository: RunnerRepository,
    val raceRunnerRepository: RaceRunnerRepository,
    val s3Service: S3Service,
) {
    private fun isAdmin(): Boolean =
        SecurityContextHolder
            .getContext()
            .authentication
            ?.authorities
            ?.any { it.authority == UserRole.ADMIN.toString() } == true

    fun getAll(filter: RaceFilter): List<RaceDTO> {
        val effectiveFilter = if (isAdmin()) filter else filter.copy(isPublished = true)
        return raceRepository.findAllByFilter(effectiveFilter).map { it.toDto() }
    }

    fun findByUuid(uuid: UUID): RaceDTO {
        val race =
            raceRepository.findByIdOrNull(uuid)
                ?: throw NoSuchElementException("Race with id $uuid not found")
        if (!isAdmin() && !race.isPublished) {
            throw NoSuchElementException("Race with id $uuid not found")
        }
        return race.toDto()
    }

    fun createRaces(races: List<RaceInput>): List<RaceDTO> =
        raceRepository
            .saveAll(
                races.map {
                    RaceEntity(
                        raceDate = it.raceDate,
                        weather = it.weather,
                    )
                },
            ).map { it.toDto() }

    fun updateRace(
        uuid: UUID,
        updatedRace: RaceInput,
    ): RaceDTO {
        val existingRace =
            raceRepository
                .findById(uuid)
                .orElseThrow { NoSuchElementException("Race with uuid $uuid not found") }

        existingRace.apply {
            raceDate = updatedRace.raceDate
            weather = updatedRace.weather
        }

        return raceRepository.save(existingRace).toDto()
    }

    fun deleteRaceById(uuid: UUID) = raceRepository.deleteById(uuid)

    @Transactional
    fun publishRace(uuid: UUID): RaceDTO {
        val race =
            raceRepository.findByIdOrNull(uuid)
                ?: throw NoSuchElementException("Race $uuid not found")
        race.runners.forEach { raceRunner ->
            require(
                (raceRunner.hideTime && raceRunner.resultTime == null) || (raceRunner.resultTime != null && !raceRunner.resultTime!!.isZero),
            ) {
                "Løper ${raceRunner.runner.name} mangler tid"
            }
        }
        race.isPublished = true
        return race.toDto()
    }

    fun findAllRunnersInRace(uuid: UUID): List<RaceRunnerDTO> {
        val race =
            raceRepository.findByIdOrNull(uuid)
                ?: throw NoSuchElementException("Race with id $uuid not found")
        if (!isAdmin() && !race.isPublished) {
            throw NoSuchElementException("Race with id $uuid not found")
        }
        return race.runners.map { it.toDto() }
    }

    fun getResultSummary(uuid: UUID): RaceResultSummaryDto {
        val runners = findAllRunnersInRace(uuid)
        return RaceResultSummaryDto(
            participants = runners.size,
            male = runners.count { it.runner.gender == Gender.MALE },
            female = runners.count { it.runner.gender == Gender.FEMALE },
            seasonBestCount = runners.count { it.isNewSeasonBest() },
            personalBestCount = runners.count { it.isNewPersonalRecord() },
            debutantCount = runners.count { it.totalRaces == 1 },
        )
    }

    @Transactional
    fun addRunnersToRace(
        raceUuid: UUID,
        runners: List<RaceRunnerDTO>,
    ): List<RaceRunnerDTO> {
        val race =
            raceRepository.findByIdOrNull(raceUuid)
                ?: throw NoSuchElementException("Race $raceUuid not found")

        val runnerUuids = runners.map { it.runner.uuid }
        val runnerEntities = runnerRepository.findAllById(runnerUuids).associateBy { it.uuid }
        val newEntities =
            runners.map { dto ->
                val runnerEntity =
                    runnerEntities[dto.runner.uuid]
                        ?: throw NoSuchElementException("Runner ${dto.runner.uuid} not found")
                RaceRunnerEntity(
                    id = RaceRunnerKey(runnerUuid = runnerEntity.uuid, raceUuid = raceUuid),
                    runner = runnerEntity,
                    race = race,
                    resultTime = dto.resultTime,
                    hideTime = dto.hideTime,
                )
            }
        return raceRunnerRepository.saveAll(newEntities).map { it.toDto() }
    }

    @Transactional
    fun addPhotosToRace(
        raceUuid: UUID,
        photoNames: List<String>,
    ): Map<String, PhotoUploadInfo> {
        val race = raceRepository.findById(raceUuid).orElseThrow { NoSuchElementException("Race $raceUuid not found") }
        val s3FileEntitiesMap = photoNames.associateWith { s3Service.createFileEntity("race-photos/$raceUuid/$it") }
        race.photos.addAll(s3FileEntitiesMap.values)
        return photoNames.associateWith {
            PhotoUploadInfo(
                uploadUrl = s3Service.getPresignedUrl("race-photos/$raceUuid/$it"),
                s3File = s3FileEntitiesMap[it]!!.toDtoDangerously(),
            )
        }
    }

    fun updateRunnerInRace(
        raceUuid: UUID,
        runnerUuid: UUID,
        runnerDto: RaceRunnerDTO,
    ): RaceRunnerDTO {
        val key = RaceRunnerKey(runnerUuid = runnerUuid, raceUuid = raceUuid)
        val entity =
            raceRunnerRepository
                .findById(key)
                .orElseThrow { NoSuchElementException("Runner $runnerUuid not found in race $raceUuid") }
        entity.apply {
            resultTime = runnerDto.resultTime
            hideTime = runnerDto.hideTime
        }
        return raceRunnerRepository.save(entity).toDto()
    }

    fun removeRunnersFromRace(
        raceUuid: UUID,
        runnerUuids: Set<UUID>,
    ) {
        val race =
            raceRepository.findByIdOrNull(raceUuid)
                ?: throw NoSuchElementException("Race $raceUuid not found")
        race.runners.removeIf { it.runner.uuid in runnerUuids }
        raceRepository.save(race)
    }
}
