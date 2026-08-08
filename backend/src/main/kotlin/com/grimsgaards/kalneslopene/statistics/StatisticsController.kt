package com.grimsgaards.kalneslopene.statistics

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

    @GetMapping("/runners/overview")
    fun getRunnerOverviewStats(): RunnerOverviewStatsDto = statisticsService.getRunnerOverviewStats()
}
