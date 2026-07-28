package com.grimsgaards.kalneslopene.model.dto

import org.springframework.data.domain.Page

data class PagedResponse<T>(
    val content: List<T>,
    val page: Int,
    val pageSize: Int,
    val totalElements: Long,
    val totalPages: Int,
)

fun <T : Any> Page<T>.toPagedResponse(): PagedResponse<T> =
    PagedResponse(
        content = this.content,
        page = this.number,
        pageSize = this.size,
        totalElements = this.totalElements,
        totalPages = this.totalPages,
    )
