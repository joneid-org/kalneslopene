package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.FileDto
import com.grimsgaards.kalneslopene.model.dto.NewsfeedDTO
import com.grimsgaards.kalneslopene.model.dto.NewsfeedTagDTO
import com.grimsgaards.kalneslopene.model.dto.PagedResponse
import com.grimsgaards.kalneslopene.model.input.NewsfeedInput
import com.grimsgaards.kalneslopene.model.input.NewsfeedTagInput
import com.grimsgaards.kalneslopene.model.input.NewsfeedTagUpdateInput
import com.grimsgaards.kalneslopene.model.input.PhotoUploadInfo
import com.grimsgaards.kalneslopene.service.NewsfeedService
import com.grimsgaards.kalneslopene.service.NewsfeedTagService
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.verify
import org.mockito.stubbing.OngoingStubbing
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post
import java.time.OffsetDateTime
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

    @Nested
    inner class GetNewsfeedList {
        @Test
        fun `passes page and pageSize through and serialises the paged response`() {
            val newsUuid = UUID.randomUUID()
            val paged =
                PagedResponse(
                    content = listOf(newsfeedDto(newsUuid)),
                    page = 1,
                    pageSize = 6,
                    totalElements = 7,
                    totalPages = 2,
                )
            whenever(newsfeedService.getNewsfeedPage(1, 6)).thenReturn(paged)

            mockMvc
                .get("/api/newsfeeds") {
                    param("page", "1")
                    param("pageSize", "6")
                }.andExpect {
                    status { isOk() }
                    jsonPath("$.content[0].uuid") { value(newsUuid.toString()) }
                    jsonPath("$.content[0].header") { value("Overskrift") }
                    jsonPath("$.page") { value(1) }
                    jsonPath("$.pageSize") { value(6) }
                    jsonPath("$.totalElements") { value(7) }
                    jsonPath("$.totalPages") { value(2) }
                }

            verify(newsfeedService).getNewsfeedPage(1, 6)
        }

        @Test
        fun `uses default page and size when omitted`() {
            whenever(newsfeedService.getNewsfeedPage(0, 6))
                .thenReturn(PagedResponse(emptyList(), 0, 6, 0, 0))

            mockMvc
                .get("/api/newsfeeds")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.content") { isEmpty() }
                }

            verify(newsfeedService).getNewsfeedPage(0, 6)
        }

        @Test
        fun `rejects a non-numeric page`() {
            mockMvc
                .get("/api/newsfeeds") {
                    param("page", "notANumber")
                }.andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class GetNewsfeed {
        @Test
        fun `returns the newsfeed for a uuid`() {
            val uuid = UUID.randomUUID()
            whenever(newsfeedService.findByUuid(uuid)).thenReturn(newsfeedDto(uuid))

            mockMvc
                .get("/api/newsfeeds/$uuid")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.uuid") { value(uuid.toString()) }
                    jsonPath("$.header") { value("Overskrift") }
                    jsonPath("$.content") { value("Innhold") }
                    jsonPath("$.tags[0]") { value("Løp") }
                }

            verify(newsfeedService).findByUuid(uuid)
        }

        @Test
        fun `rejects a malformed uuid`() {
            mockMvc
                .get("/api/newsfeeds/not-a-uuid")
                .andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class CreateNewsfeed {
        @Test
        fun `deserialises the body, delegates and serialises the result`() {
            val uuid = UUID.randomUUID()
            val input = newsfeedInput()
            whenever(newsfeedService.createNewsfeed(input)).thenReturn(newsfeedDto(uuid))

            mockMvc
                .post("/api/newsfeeds/createNewsfeed") {
                    contentType = MediaType.APPLICATION_JSON
                    content = newsfeedInputJson("Overskrift")
                }.andExpect {
                    status { isOk() }
                    jsonPath("$.uuid") { value(uuid.toString()) }
                    jsonPath("$.header") { value("Overskrift") }
                }

            verify(newsfeedService).createNewsfeed(input)
        }

        @Test
        fun `rejects a missing request body`() {
            mockMvc
                .post("/api/newsfeeds/createNewsfeed")
                .andExpect {
                    status { isBadRequest() }
                }
        }

        @Test
        fun `rejects malformed json`() {
            mockMvc
                .post("/api/newsfeeds/createNewsfeed") {
                    contentType = MediaType.APPLICATION_JSON
                    content = "{ not valid json"
                }.andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class UpdateNewsfeed {
        @Test
        fun `passes the uuid and body through and serialises the result`() {
            val uuid = UUID.randomUUID()
            val input = newsfeedInput(header = "Endret")
            whenever(newsfeedService.updateNewsfeed(uuid, input))
                .thenReturn(newsfeedDto(uuid).copy(header = "Endret"))

            mockMvc
                .patch("/api/newsfeeds/$uuid") {
                    contentType = MediaType.APPLICATION_JSON
                    content = newsfeedInputJson("Endret")
                }.andExpect {
                    status { isOk() }
                    jsonPath("$.uuid") { value(uuid.toString()) }
                    jsonPath("$.header") { value("Endret") }
                }

            verify(newsfeedService).updateNewsfeed(uuid, input)
        }

        @Test
        fun `rejects a malformed uuid`() {
            mockMvc
                .patch("/api/newsfeeds/not-a-uuid") {
                    contentType = MediaType.APPLICATION_JSON
                    content = newsfeedInputJson("Overskrift")
                }.andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class DeleteNewsfeed {
        @Test
        fun `delegates deletion for the given uuid`() {
            val uuid = UUID.randomUUID()

            mockMvc
                .delete("/api/newsfeeds/$uuid")
                .andExpect {
                    status { isOk() }
                }

            verify(newsfeedService).deleteNewsfeed(uuid)
        }

        @Test
        fun `rejects a malformed uuid`() {
            mockMvc
                .delete("/api/newsfeeds/not-a-uuid")
                .andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class HeaderImage {
        @Test
        fun `passes fileName through and serialises the upload info`() {
            val fileUuid = UUID.randomUUID()
            val info =
                PhotoUploadInfo(
                    uploadUrl = "https://minio.local/presigned",
                    s3File = FileDto(fileUuid, "https://minio.local/bucket/newsfeed-photos/x/pic.jpg"),
                )
            whenever(newsfeedService.createHeaderImageUpload("pic.jpg")).thenReturn(info)

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
        fun `without fileName is a bad request`() {
            mockMvc
                .post("/api/newsfeeds/header-image")
                .andExpect {
                    status { isBadRequest() }
                }
        }
    }

    @Nested
    inner class Tags {
        @Test
        fun `GET tags lists all tags`() {
            whenever(newsfeedTagService.getAllTags())
                .thenReturn(listOf(NewsfeedTagDTO("Løp", "#ff0000"), NewsfeedTagDTO("Info", "#00ff00")))

            mockMvc
                .get("/api/newsfeeds/tags")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.length()") { value(2) }
                    jsonPath("$[0].value") { value("Løp") }
                    jsonPath("$[0].color") { value("#ff0000") }
                }

            verify(newsfeedTagService).getAllTags()
        }

        @Test
        fun `POST tags creates a tag from the body`() {
            val input = NewsfeedTagInput("Løp", "#ff0000")
            whenever(newsfeedTagService.createTag(input)).thenReturn(NewsfeedTagDTO("Løp", "#ff0000"))

            mockMvc
                .post("/api/newsfeeds/tags") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """{"value":"Løp","color":"#ff0000"}"""
                }.andExpect {
                    status { isOk() }
                    jsonPath("$.value") { value("Løp") }
                    jsonPath("$.color") { value("#ff0000") }
                }

            verify(newsfeedTagService).createTag(input)
        }

        @Test
        fun `POST tags rejects malformed json`() {
            mockMvc
                .post("/api/newsfeeds/tags") {
                    contentType = MediaType.APPLICATION_JSON
                    content = "{ not valid json"
                }.andExpect {
                    status { isBadRequest() }
                }
        }

        @Test
        fun `PATCH tags updates the colour for the given value`() {
            val input = NewsfeedTagUpdateInput("#0000ff")
            whenever(newsfeedTagService.updateTag("Løp", input))
                .thenReturn(NewsfeedTagDTO("Løp", "#0000ff"))

            mockMvc
                .patch("/api/newsfeeds/tags/Løp") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """{"color":"#0000ff"}"""
                }.andExpect {
                    status { isOk() }
                    jsonPath("$.value") { value("Løp") }
                    jsonPath("$.color") { value("#0000ff") }
                }

            verify(newsfeedTagService).updateTag("Løp", input)
        }

        @Test
        fun `DELETE tags delegates deletion for the given value`() {
            mockMvc
                .delete("/api/newsfeeds/tags/Løp")
                .andExpect {
                    status { isOk() }
                }

            verify(newsfeedTagService).deleteTag("Løp")
        }
    }

    private fun newsfeedDto(uuid: UUID) =
        NewsfeedDTO(
            uuid = uuid,
            tags = listOf("Løp"),
            header = "Overskrift",
            content = "Innhold",
            date = OffsetDateTime.parse("2026-07-01T12:00:00Z"),
        )

    private fun newsfeedInput(header: String = "Overskrift") =
        NewsfeedInput(
            tags = listOf("Løp"),
            header = header,
            content = "Innhold",
            date = OffsetDateTime.parse("2026-07-01T12:00:00Z"),
        )

    // Mirrors newsfeedInput() so the deserialised body matches the stubbed argument by equality.
    private fun newsfeedInputJson(header: String) =
        """{"tags":["Løp"],"header":"$header","content":"Innhold","date":"2026-07-01T12:00:00Z"}"""

    private fun <T> whenever(call: T): OngoingStubbing<T> = Mockito.`when`(call)
}
