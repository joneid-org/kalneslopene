package com.grimsgaards.kalneslopene.race

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.race.dto.RaceDTO
import com.grimsgaards.kalneslopene.race.dto.RaceFilter
import com.grimsgaards.kalneslopene.race.dto.RaceInfoDto
import com.grimsgaards.kalneslopene.race.dto.RaceInput
import com.grimsgaards.kalneslopene.race.dto.RaceResultSummaryDto
import com.grimsgaards.kalneslopene.race.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.race.dto.ReorderPhotoInput
import com.grimsgaards.kalneslopene.race.model.RaceEntity
import com.grimsgaards.kalneslopene.race.model.RacePhotoEntity
import com.grimsgaards.kalneslopene.race.model.RacePhotoRepository
import com.grimsgaards.kalneslopene.race.model.RaceRepository
import com.grimsgaards.kalneslopene.race.model.RaceRunnerEntity
import com.grimsgaards.kalneslopene.race.model.RaceRunnerRepository
import com.grimsgaards.kalneslopene.runner.Gender
import com.grimsgaards.kalneslopene.runner.RunnerRepository
import com.grimsgaards.kalneslopene.s3.PhotoDto
import com.grimsgaards.kalneslopene.s3.PhotoEntity
import com.grimsgaards.kalneslopene.s3.RacePhotoUploadInfo
import com.grimsgaards.kalneslopene.s3.S3Service
import com.grimsgaards.kalneslopene.s3.ThumbnailUploadInfo
import com.grimsgaards.kalneslopene.security.AuthenticatedUserProvider
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

const val MAX_RACE_PAGE_SIZE = 20
const val RACE_INFO_CACHE = "raceInfo"

@Suppress("TooManyFunctions")
@Service
class RaceService(
    val raceRepository: RaceRepository,
    val runnerRepository: RunnerRepository,
    val raceRunnerRepository: RaceRunnerRepository,
    val racePhotoRepository: RacePhotoRepository,
    val s3Service: S3Service,
    val authenticatedUserProvider: AuthenticatedUserProvider,
) {
    private val logger = logger()

    @Cacheable(RACE_INFO_CACHE)
    fun getAllInfo(
        isPublished: Boolean?,
        containsPictures: Boolean?,
    ): List<RaceInfoDto> = raceRepository.findAllInfoByFilter(RaceFilter(isPublished = isPublished, containsPictures = containsPictures))

    fun getAll(
        filter: RaceFilter,
        page: Int,
        pageSize: Int?,
        sortDirection: Sort.Direction = Sort.Direction.DESC,
    ): Page<RaceDTO> {
        val effectiveFilter = if (authenticatedUserProvider.isAdmin()) filter else filter.copy(isPublished = true)
        return raceRepository
            .findAllByFilter(effectiveFilter, resolvePageable(filter, page, pageSize, sortDirection))
            .also { confirmPendingPhotos(it.content) }
            .map { it.toDto() }
    }

    private fun resolvePageable(
        filter: RaceFilter,
        page: Int,
        pageSize: Int?,
        sortDirection: Sort.Direction = Sort.Direction.DESC,
    ): Pageable {
        val sort = Sort.by(sortDirection, "raceDate")
        if (pageSize == null) {
            require(filter.spansSingleYear()) {
                "pageSize is required unless the filter has from and to within the same year"
            }
            return Pageable.unpaged(sort)
        }
        require(pageSize in 1..MAX_RACE_PAGE_SIZE) { "pageSize must be between 1 and $MAX_RACE_PAGE_SIZE" }
        return PageRequest.of(page, pageSize, sort)
    }

    fun findNextRace(): RaceDTO? =
        raceRepository
            .findFirstByRaceDateGreaterThanEqualOrderByRaceDateAsc(LocalDateTime.now())
            ?.toDto()

    fun findByUuid(uuid: UUID): RaceDTO {
        val race =
            raceRepository.findByIdOrNull(uuid)
                ?: throw NoSuchElementException("Race with id $uuid not found")
        if (!authenticatedUserProvider.isAdmin() && !race.isPublished) {
            throw NoSuchElementException("Race with id $uuid not found")
        }
        confirmPendingPhotos(listOf(race))
        return race.toDto()
    }

    private fun confirmPendingPhotos(races: Collection<RaceEntity>) {
        races.forEach { race ->
            val pending =
                race.racePhotos
                    .flatMap { listOfNotNull(it.photo.photoFile, it.photo.thumbnailFile) }
                    .filter { it.uploadConfirmedAt == null }
            if (pending.isEmpty()) return@forEach
            runCatching { s3Service.confirmUploadedFiles(pending, racePhotoPrefix(race.uuid)) }
                .onFailure { logger.warn("Could not confirm pending photos for race ${race.uuid}", it) }
        }
    }

    private fun racePhotoPrefix(raceUuid: UUID) = "race-photos/$raceUuid/"

    private fun thumbnailKey(objectKey: String) = "${objectKey.substringBeforeLast('/')}/thumbs/${objectKey.substringAfterLast('/')}"

    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun createRaces(races: List<RaceInput>): List<RaceDTO> =
        raceRepository
            .saveAll(races.map { RaceEntity(raceDate = it.raceDate) })
            .map { it.toDto() }

    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
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

    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun deleteRaceById(uuid: UUID) = raceRepository.deleteById(uuid)

    @Transactional
    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun publishRace(uuid: UUID): RaceDTO {
        val race =
            raceRepository.findByIdOrNull(uuid)
                ?: throw NoSuchElementException("Race $uuid not found")
        race.runners.forEach { raceRunner ->
            require(
                raceRunner.hideTime ||
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
        if (!authenticatedUserProvider.isAdmin() && !race.isPublished) {
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
                    resultTime = if (dto.hideTime) null else dto.resultTime,
                    hideTime = dto.hideTime,
                )
            }
        return raceRunnerRepository.saveAll(newEntities).map { it.toDto() }
    }

    @Transactional
    @CacheEvict(RACE_INFO_CACHE, allEntries = true)
    fun addPhotosToRace(
        raceUuid: UUID,
        photoNames: List<String>,
    ): Map<String, RacePhotoUploadInfo> {
        val race = raceRepository.findById(raceUuid).orElseThrow { NoSuchElementException("Race $raceUuid not found") }
        val prefix = racePhotoPrefix(raceUuid)
        val keysByName = photoNames.associateWith { "$prefix${UUID.randomUUID()}-$it" }
        val files = s3Service.createFileEntities(keysByName.values.flatMap { listOf(it, thumbnailKey(it)) })
        var nextOrderIndex = (race.racePhotos.maxOfOrNull { it.orderIndex } ?: 0.0) + 1
        return keysByName.mapValues { (_, key) ->
            val photo = PhotoEntity(photoFile = files.getValue(key), thumbnailFile = files.getValue(thumbnailKey(key)))
            race.racePhotos.add(RacePhotoEntity(race = race, photo = photo, orderIndex = nextOrderIndex++))
            RacePhotoUploadInfo(
                uploadUrl = s3Service.getPresignedUrl(key, immutable = true),
                thumbnailUploadUrl = s3Service.getPresignedUrl(thumbnailKey(key), immutable = true),
                photo = photo.toDtoDangerously(),
            )
        }
    }

    @Transactional
    fun requestThumbnailUploads(raceUuid: UUID): List<ThumbnailUploadInfo> {
        val race = raceRepository.findByIdOrNull(raceUuid) ?: throw NoSuchElementException("Race $raceUuid not found")
        val missing =
            race.racePhotos
                .map { it.photo }
                .filter { it.photoFile.uploadConfirmedAt != null && it.thumbnailFile == null }
        if (missing.isEmpty()) return emptyList()
        val keysByPhoto = missing.associateWith { thumbnailKey(s3Service.objectKeyOf(it.photoFile.url)) }
        val files = s3Service.createFileEntities(keysByPhoto.values.toList())
        return keysByPhoto.map { (photo, key) ->
            photo.thumbnailFile = files.getValue(key)
            ThumbnailUploadInfo(
                photo = photo.toDtoDangerously(),
                uploadUrl = s3Service.getPresignedUrl(key, immutable = true),
            )
        }
    }

    // Deleting the files cascades to photo and race_photo in the database.
    fun deletePhotos(
        raceUuid: UUID,
        photoUuids: List<UUID>,
    ) = s3Service.deleteFilesByUuid(racePhotoRepository.findFileUuidsOfPhotos(raceUuid, photoUuids))

    @Transactional
    fun reorderPhotoInRace(
        raceUuid: UUID,
        input: ReorderPhotoInput,
    ): List<PhotoDto> {
        val photos = racePhotoRepository.findAllByRaceUuidOrderByOrderIndexAsc(raceUuid)
        val moved =
            photos.find { it.photo.uuid == input.photoUuid }
                ?: throw NoSuchElementException("Photo ${input.photoUuid} not found in race $raceUuid")
        val others = photos.filter { it.photo.uuid != input.photoUuid }

        val anchorUuid = input.beforePhotoUuid ?: input.afterPhotoUuid!!
        val anchorIndex = others.indexOfFirst { it.photo.uuid == anchorUuid }
        require(anchorIndex >= 0) { "Photo $anchorUuid not found in race $raceUuid" }

        moved.orderIndex =
            if (input.beforePhotoUuid != null) {
                val prev = others.getOrNull(anchorIndex - 1)
                val next = others[anchorIndex]
                if (prev != null) (prev.orderIndex + next.orderIndex) / 2 else next.orderIndex - 1
            } else {
                val prev = others[anchorIndex]
                val next = others.getOrNull(anchorIndex + 1)
                if (next != null) (prev.orderIndex + next.orderIndex) / 2 else prev.orderIndex + 1
            }
        racePhotoRepository.save(moved)

        return (others + moved).sortedBy { it.orderIndex }.mapNotNull { it.photo.toDto() }
    }

    @Transactional
    fun updatePhotographer(
        raceUuid: UUID,
        photographer: String?,
    ): RaceDTO {
        val race =
            raceRepository.findByIdOrNull(raceUuid)
                ?: throw NoSuchElementException("Race $raceUuid not found")
        race.photographer = photographer?.trim()?.ifEmpty { null }
        return race.toDto()
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
            resultTime = if (runnerDto.hideTime) null else runnerDto.resultTime
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
