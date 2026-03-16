package com.grimsgaards.kalneslopene.service

import com.grimsgaards.kalneslopene.model.dto.OrganizerDTO
import com.grimsgaards.kalneslopene.repository.OrganizerRepository
import org.springframework.stereotype.Service

@Service
class OrganizerService(
    val organizerRepository: OrganizerRepository
) {
    fun getAll(): List<OrganizerDTO> {
        return organizerRepository.findAll().map { it.toDto() }
    }

}
