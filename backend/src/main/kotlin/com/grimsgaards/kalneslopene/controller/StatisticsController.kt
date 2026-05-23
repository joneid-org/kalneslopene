package com.grimsgaards.kalneslopene.controller

import com.grimsgaards.kalneslopene.model.dto.RaceStatisticsDto
import com.grimsgaards.kalneslopene.service.StatisticsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Year

@RestController
@RequestMapping("/api/statistics")
class StatisticsController(
    private val statisticsService: StatisticsService,
) {

    @GetMapping("/races")
    fun getRaceStatistics(year: Year?): RaceStatisticsDto = statisticsService.getRaceStatistics(year)

}

