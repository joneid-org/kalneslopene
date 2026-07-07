package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.FileDto
import com.grimsgaards.kalneslopene.model.dto.PagedResponse
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.service.NewsfeedService
import com.grimsgaards.kalneslopene.service.NewsfeedTagService
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.UUID

@WebMvcTest(NewsfeedController::class)
@AutoConfigureMockMvc(addFilters = false)
class NewsfeedControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockitoBean
    lateinit var newsfeedService: NewsfeedService

    @MockitoBean
    lateinit var newsfeedTagService: NewsfeedTagService

    @Test
    fun `POST header-image passes fileName through and serialises the upload info`() {
        val fileUuid = UUID.randomUUID()
        val info =
            PhotoUploadInfo(
                uploadUrl = "https://minio.local/presigned",
                s3File = FileDto(fileUuid, "https://minio.local/bucket/newsfeed-photos/x/pic.jpg"),
            )
        Mockito.`when`(newsfeedService.createHeaderImageUpload("pic.jpg")).thenReturn(info)

        mockMvc
            .post("/api/newsfeeds/header-image") {
                param("fileName", "pic.jpg")
            }.andExpect {
                status { isOk() }
                jsonPath("$.uploadUrl") { value("https://minio.local/presigned") }
                jsonPath("$.s3File.uuid") { value(fileUuid.toString()) }
                jsonPath("$.s3File.url") { value("https://minio.local/bucket/newsfeed-photos/x/pic.jpg") }
            }

        verify(newsfeedService).createHeaderImageUpload("pic.jpg")
    }

    @Test
    fun `POST header-image without fileName is a bad request`() {
        mockMvc
            .post("/api/newsfeeds/header-image")
            .andExpect {
                status { isBadRequest() }
            }
    }

  /*  @Test
    fun `GET archive passes page and size through and serialises the paged response`() {
        val newsUuid = UUID.randomUUID()
        val paged =
            PagedResponse(
                content =
                    listOf(
                        NewsfeedDTO(
                            uuid = newsUuid,
                            tags = listOf("Løp"),
                            header = "Overskrift",
                            content = "Innhold",
                            date = OffsetDateTime.parse("2026-07-01T12:00:00Z"),
                        ),
                    ),
                page = 1,
                pageSize = 6,
                totalElements = 7,
                totalPages = 2,
            )
        Mockito.`when`(newsfeedService.getNewsfeedPage(1, 6)).thenReturn(paged)

        mockMvc
            .get("/api/newsfeeds") {
                param("page", "1")
                param("pageSize", "6")
            }.andExpect {
                status { isOk() }
                jsonPath("$.content[0].uuid") { value(newsUuid.toString()) }
                jsonPath("$.page") { value(1) }
                jsonPath("$.pageSize") { value(6) }
                jsonPath("$.totalElements") { value(7) }
                jsonPath("$.totalPages") { value(2) }
            }

        verify(newsfeedService).getNewsfeedPage(1, 6)
    }
   */

    @Test
    fun `GET archive uses default page and size when omitted`() {
        Mockito
            .`when`(newsfeedService.getNewsfeedPage(0, 6))
            .thenReturn(PagedResponse(emptyList(), 0, 6, 0, 0))

        mockMvc
            .get("/api/newsfeeds")
            .andExpect {
                status { isOk() }
            }

        verify(newsfeedService).getNewsfeedPage(0, 6)
    }
}
