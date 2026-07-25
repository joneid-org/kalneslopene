package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.FileDto
import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RaceDTO
import com.grimsgaards.kalneslopene.model.dto.RaceResultSummaryDto
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RacePhotoEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.entities.UserRole
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.model.input.RaceFilter
import com.grimsgaards.kalneslopene.model.input.RaceInput
import com.grimsgaards.kalneslopene.model.input.ReorderPhotoInput
import com.grimsgaards.kalneslopene.repository.RacePhotoRepository
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
    val racePhotoRepository: RacePhotoRepository,
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
            .saveAll(races.map { RaceEntity(raceDate = it.raceDate) })
            .map { it.toDto() }

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
            courseCondition = updatedRace.courseCondition
        }
        existingRace.applyWeatherOverride(updatedRace.weather)

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
                (raceRunner.hideTime && raceRunner.resultTime == null) ||
                    (raceRunner.resultTime != null && !raceRunner.resultTime!!.isZero),
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
        val s3FileEntitiesMap = s3Service.createFileEntities(photoNames.map { "race-photos/$raceUuid/$it" })
        var nextOrderIndex = (race.racePhotos.maxOfOrNull { it.orderIndex } ?: 0.0) + 1
        s3FileEntitiesMap.values.forEach { file ->
            race.racePhotos.add(RacePhotoEntity(race = race, file = file, orderIndex = nextOrderIndex++))
        }
        return photoNames.associateWith {
            PhotoUploadInfo(
                uploadUrl = s3Service.getPresignedUrl("race-photos/$raceUuid/$it", immutable = true),
                s3File = s3FileEntitiesMap["race-photos/$raceUuid/$it"]!!.toDtoDangerously(),
            )
        }
    }

    @Transactional
    fun reorderPhotoInRace(
        raceUuid: UUID,
        input: ReorderPhotoInput,
    ): List<FileDto> {
        val photos = racePhotoRepository.findAllByRaceUuidOrderByOrderIndexAsc(raceUuid)
        val moved =
            photos.find { it.file.uuid == input.fileUuid }
                ?: throw NoSuchElementException("Photo ${input.fileUuid} not found in race $raceUuid")
        val others = photos.filter { it.file.uuid != input.fileUuid }

        val anchorUuid = input.beforeFileUuid ?: input.afterFileUuid!!
        val anchorIndex = others.indexOfFirst { it.file.uuid == anchorUuid }
        require(anchorIndex >= 0) { "Photo $anchorUuid not found in race $raceUuid" }

        moved.orderIndex =
            if (input.beforeFileUuid != null) {
                val prev = others.getOrNull(anchorIndex - 1)
                val next = others[anchorIndex]
                if (prev != null) (prev.orderIndex + next.orderIndex) / 2 else next.orderIndex - 1
            } else {
                val prev = others[anchorIndex]
                val next = others.getOrNull(anchorIndex + 1)
                if (next != null) (prev.orderIndex + next.orderIndex) / 2 else prev.orderIndex + 1
            }
        racePhotoRepository.save(moved)

        return (others + moved).sortedBy { it.orderIndex }.mapNotNull { it.file.toDto() }
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
