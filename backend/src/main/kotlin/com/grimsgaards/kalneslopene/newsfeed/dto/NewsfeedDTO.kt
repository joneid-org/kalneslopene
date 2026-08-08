package com.grimsgaards.kalneslopene.newsfeed.dto

import com.grimsgaards.kalneslopene.race.dto.RaceDTO
import com.grimsgaards.kalneslopene.s3.FileDto
import java.time.OffsetDateTime
import java.util.UUID

data class NewsfeedDTO(
    val uuid: UUID,
    val tags: List<String>,
    val header: String,
    val content: String,
    val date: OffsetDateTime,
    val headerImage: FileDto? = null,
    val images: List<String> = emptyList(),
    val connectedRace: RaceDTO? = null,
)
