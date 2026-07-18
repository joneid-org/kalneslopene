package com.grimsgaards.kalneslopene.data

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

@Component
@ConditionalOnProperty(prefix = "baseline-data", name = ["enabled"], havingValue = "true")
class BaselineDataGenerator(
    private val runnerRepository: RunnerRepository,
    private val raceRepository: RaceRepository,
    private val raceRunnerRepository: RaceRunnerRepository,
) : CommandLineRunner {
    private val log = logger()

    private val runnersByName = mutableMapOf<String, RunnerEntity>()

    private data class ResultRow(
        val gender: Gender,
        val name: String,
        val time: Duration?,
        val date: LocalDate,
    )

    @Transactional
    override fun run(vararg args: String) {
        if (runnerRepository.count() > 0) {
            log.info("Baseline data already present, skipping generation")
            return
        }
        log.info("Populating baseline data from csv files")
        populateRunners()
        val results = readResultRows()
        val racesByDate = populateRaces(results)
        populateRaceRunners(results, racesByDate)

        log.info(
            "Populated ${runnerRepository.count()} runners and ${racesByDate.size} past races with results from csv files.",
        )
    }

    private fun populateRunners(): List<RunnerEntity> {
        val runners =
            readCsv(PERSER_FILE).mapNotNull { cols ->
                val gender = parseGender(cols.getOrNull(0)) ?: return@mapNotNull null
                val name = cols.getOrNull(1)?.trim().orEmpty()
                if (name.isEmpty()) return@mapNotNull null
                val personalRecord = parseTime(cols.getOrNull(2))
                RunnerEntity(
                    name = name,
                    gender = gender,
                    historicPersonalRecord = personalRecord,
                    historicSeasonRecord = personalRecord,
                )
            }
        val saved = runnerRepository.saveAll(runners)
        saved.forEach { runnersByName[it.name] = it }
        return saved
    }

    private fun populateRaces(results: List<ResultRow>): Map<LocalDate, RaceEntity> {
        val races =
            results
                .map { it.date }
                .distinct()
                .sorted()
                .map { RaceEntity(raceDate = it.atTime(RACE_HOUR, 0), weather = null) }
        return raceRepository.saveAll(races).associateBy { it.raceDate.toLocalDate() }
    }

    private fun populateRaceRunners(
        results: List<ResultRow>,
        racesByDate: Map<LocalDate, RaceEntity>,
    ) {
        // The runner_stats view is not usable mid-transaction, so track the records here.
        // Historic personal records seed the "previous" record before the first recorded race.
        val personalRecords = mutableMapOf<UUID, Duration>()
        runnersByName.values.forEach { runner ->
            runner.historicPersonalRecord?.let { personalRecords[runner.uuid] = it }
        }
        val seasonRecords = mutableMapOf<Pair<UUID, Int>, Duration>()
        val raceCounts = mutableMapOf<UUID, Int>()

        val raceRunners =
            results.map { row ->
                val runner =
                    runnersByName.getOrPut(row.name) {
                        runnerRepository.save(RunnerEntity(name = row.name, gender = row.gender))
                    }
                val race = racesByDate.getValue(row.date)
                val seasonKey = runner.uuid to row.date.year
                val totalRaces = raceCounts.getOrDefault(runner.uuid, 0) + 1
                val raceRunner =
                    RaceRunnerEntity(
                        runner = runner,
                        race = race,
                        // "Deltatt" rows have no recorded time; stored as null with hideTime = true.
                        resultTime = row.time,
                        hideTime = row.time == null,
                        previousPersonalRecord = personalRecords[runner.uuid],
                        previousSeasonRecord = seasonRecords[seasonKey],
                        totalRaces = totalRaces,
                    )
                row.time?.let {
                    personalRecords.merge(runner.uuid, it, ::minOf)
                    seasonRecords.merge(seasonKey, it, ::minOf)
                }
                raceCounts[runner.uuid] = totalRaces
                raceRunner
            }
        raceRunnerRepository.saveAll(raceRunners)
    }

    private fun readResultRows(): List<ResultRow> =
        RESULT_FILES
            .flatMap { file ->
                readCsv(file).mapNotNull { cols ->
                    val gender = parseGender(cols.getOrNull(0)) ?: return@mapNotNull null
                    val name = cols.getOrNull(1)?.trim().orEmpty()
                    if (name.isEmpty()) return@mapNotNull null
                    val date = parseDate(cols.getOrNull(3)) ?: return@mapNotNull null
                    ResultRow(gender, name, parseTime(cols.getOrNull(2)), date)
                }
            }.sortedBy { it.date }

    private fun readCsv(path: String): List<List<String>> =
        ClassPathResource(path).inputStream.bufferedReader(Charsets.UTF_8).useLines { lines ->
            lines
                .drop(1)
                .map { it.trim() }
                .filter { it.isNotEmpty() }
                .map { line -> line.split(";").map { it.trim() } }
                .toList()
        }

    private fun parseGender(raw: String?): Gender? =
        when (raw?.trim()?.uppercase()) {
            "H" -> Gender.MALE
            "D" -> Gender.FEMALE
            else -> null
        }

    private fun parseTime(raw: String?): Duration? {
        val match = raw?.let { TIME_REGEX.matchEntire(it.trim()) } ?: return null
        val (minutes, seconds) = match.destructured
        return Duration.ofMinutes(minutes.toLong()).plusSeconds(seconds.toLong())
    }

    private fun parseDate(raw: String?): LocalDate? =
        raw?.trim()?.takeIf { it.isNotEmpty() }?.let {
            runCatching { LocalDate.parse(it, DATE_FORMAT) }.getOrNull()
        }

    companion object {
        private const val RACE_HOUR = 18
        private const val PERSER_FILE = "Resultater/Perser2018.csv"
        private val RESULT_FILES =
            (2019..2026).map { "Resultater/Resultater$it.csv" }
        private val TIME_REGEX = Regex("""(\d+):(\d{2})""")
        private val DATE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yy")
    }
}
