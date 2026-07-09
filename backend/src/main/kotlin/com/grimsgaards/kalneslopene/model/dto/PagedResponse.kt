package com.grimsgaards.kalneslopene.model.dto

data class PagedResponse<T>(
    val content: List<T>,
    val page: Int,
    val pageSize: Int,
    val totalElements: Long,
    val totalPages: Int,
)
