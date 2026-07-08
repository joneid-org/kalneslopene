package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.DraftEntryDTO
import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.ResultDraftDTO
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerKey
import com.grimsgaards.kalneslopene.model.entities.ResultDraftEntity
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.ResultDraftRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.ObjectMapper
import java.time.Duration
import java.time.LocalDateTime
import java.util.UUID

internal data class ResultDraftData(
    val weather: String?,
    val entries: List<DraftEntryDTO>,
    val currentStep: Int,
)

@Service
class ResultDraftService(
    val resultDraftRepository: ResultDraftRepository,
    val raceRepository: RaceRepository,
    val runnerRepository: RunnerRepository,
    val raceRunnerRepository: RaceRunnerRepository,
    val objectMapper: ObjectMapper,
) {
    fun getDraft(raceUuid: UUID): ResultDraftDTO? = resultDraftRepository.findByIdOrNull(raceUuid)?.let { toDto(it) }

    fun saveDraft(
        raceUuid: UUID,
        dto: ResultDraftDTO,
    ): ResultDraftDTO {
        if (!raceRepository.existsById(raceUuid)) {
            throw NoSuchElementException("Race $raceUuid not found")
        }
        val payload = ResultDraftData(dto.weather, dto.entries, dto.currentStep)
        val entity =
            ResultDraftEntity(
                raceUuid = raceUuid,
                data = objectMapper.writeValueAsString(payload),
                updatedAt = LocalDateTime.now(),
            )
        return toDto(resultDraftRepository.save(entity))
    }

    fun deleteDraft(raceUuid: UUID) {
        if (resultDraftRepository.existsById(raceUuid)) {
            resultDraftRepository.deleteById(raceUuid)
        }
    }

    @Transactional
    fun publishDraft(raceUuid: UUID): List<RaceRunnerDTO> {
        val draft =
            resultDraftRepository.findByIdOrNull(raceUuid)
                ?: throw NoSuchElementException("No draft found for race $raceUuid")
        val race =
            raceRepository.findByIdOrNull(raceUuid)
                ?: throw NoSuchElementException("Race $raceUuid not found")
        val payload = objectMapper.readValue(draft.data, ResultDraftData::class.java)

        payload.entries.forEach { entry ->
            require(entry.hideTime || entry.resultTimeSeconds != null) {
                "Løper ${entry.name} mangler tid"
            }
        }

        race.weather = payload.weather
        raceRepository.save(race)

        val raceRunners =
            payload.entries.map { entry ->
                val runner =
                    if (entry.runnerUuid != null) {
                        runnerRepository.findByIdOrNull(entry.runnerUuid)
                            ?: throw NoSuchElementException("Runner ${entry.runnerUuid} not found")
                    } else {
                        runnerRepository.save(
                            RunnerEntity(
                                name = entry.name,
                                gender = Gender.valueOf(entry.gender.uppercase()),
                            ),
                        )
                    }
                RaceRunnerEntity(
                    id = RaceRunnerKey(runnerUuid = runner.uuid, raceUuid = raceUuid),
                    runner = runner,
                    race = race,
                    resultTime = Duration.ofSeconds(if (entry.hideTime) 0 else (entry.resultTimeSeconds ?: 0)),
                    hideTime = entry.hideTime,
                )
            }

        val saved = raceRunnerRepository.saveAll(raceRunners).map { it.toDto() }
        resultDraftRepository.deleteById(raceUuid)
        return saved
    }

    private fun toDto(entity: ResultDraftEntity): ResultDraftDTO {
        val payload = objectMapper.readValue(entity.data, ResultDraftData::class.java)
        return ResultDraftDTO(
            raceUuid = entity.raceUuid,
            weather = payload.weather,
            entries = payload.entries,
            currentStep = payload.currentStep,
            updatedAt = entity.updatedAt,
        )
    }
}
