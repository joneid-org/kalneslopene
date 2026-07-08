package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceRunnerDTO
import com.grimsgaards.kalneslopene.model.dto.ResultDraftDTO
import com.grimsgaards.kalneslopene.service.ResultDraftService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/races/{uuid}/result-draft")
class ResultDraftController(
    val resultDraftService: ResultDraftService,
) {
    @GetMapping
    fun getResultDraft(
        @PathVariable uuid: UUID,
    ): ResponseEntity<ResultDraftDTO> =
        resultDraftService.getDraft(uuid)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.noContent().build()

    @PutMapping
    fun saveResultDraft(
        @PathVariable uuid: UUID,
        @RequestBody draft: ResultDraftDTO,
    ): ResultDraftDTO = resultDraftService.saveDraft(uuid, draft)

    @DeleteMapping
    fun deleteResultDraft(
        @PathVariable uuid: UUID,
    ) = resultDraftService.deleteDraft(uuid)

    @PostMapping("/publish")
    fun publishResultDraft(
        @PathVariable uuid: UUID,
    ): List<RaceRunnerDTO> = resultDraftService.publishDraft(uuid)
}
