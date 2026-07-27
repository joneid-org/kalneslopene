package com.grimsgaards.kalneslopene.data

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.interceptor.TransactionAspectSupport
import java.time.Duration
import java.time.LocalDate
import java.util.UUID

/**
 * Rebuilds `runner` and `race_runner` from the `Resultater/v2` csv files, to correct data that was
 * imported from the earlier, faulty csvs.
 *
 * Races are never deleted: only races whose date appears in the csvs are touched, and only their
 * `race_runner` rows are replaced. Weather, course conditions and photos are left alone. Runners are
 * matched by name and updated in place; runners that no longer appear in any csv are reported, not
 * deleted, so results attached to races outside the csv dates keep working.
 */
@Component
@ConditionalOnProperty(prefix = "results-repair", name = ["enabled"], havingValue = "true")
class CsvResultsRepair(
    private val runnerRepository: RunnerRepository,
    private val raceRepository: RaceRepository,
    private val raceRunnerRepository: RaceRunnerRepository,
    @param:Value("\${results-repair.dry-run:true}") private val dryRun: Boolean,
) : CommandLineRunner {
    private val log = logger()

    private class RunnerProgress {
        var personalRecord: Duration? = null
        var totalRaces: Int = 0
        val seasonRecords = mutableMapOf<Int, Duration>()
        val seasonRaces = mutableMapOf<Int, Int>()
    }

    private data class TimelineEntry(
        val runnerUuid: UUID,
        val date: LocalDate,
        val time: Duration?,
        val csvRow: CsvResultRow?,
    )

    @Transactional
    override fun run(vararg args: String) {
        val results = ResultCsvReader.readResults()
        val runnerRows = ResultCsvReader.readRunners()
        val report = RepairReport()

        validate(results, report)
        val raceUuidsByDate = resolveRaces(results, report)
        report.raceRunnersDeleted = raceRunnerRepository.deleteByRaceUuidIn(raceUuidsByDate.values)

        val racesByDate = reloadRaces(raceUuidsByDate)
        val runnersByName = upsertRunners(results, runnerRows, report)
        rebuildRaceRunners(results, racesByDate, runnersByName, report)

        report.log(log, dryRun)
        if (dryRun) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()
        }
    }

    private fun validate(
        results: List<CsvResultRow>,
        report: RepairReport,
    ) {
        check(results.isNotEmpty()) { "No result rows were read from the csv files" }
        val duplicates =
            results
                .groupingBy { it.name to it.date }
                .eachCount()
                .filterValues { it > 1 }
        check(duplicates.isEmpty()) {
            "The same runner appears twice in one race, which would violate the race_runner primary key: " +
                duplicates.keys.joinToString { "${it.first} on ${it.second}" }
        }
        results
            .groupBy { it.name }
            .filterValues { rows -> rows.map { it.gender }.distinct().size > 1 }
            .forEach { (name, _) -> report.warnings += "$name has conflicting genders in the csv files" }
    }

    private fun resolveRaces(
        results: List<CsvResultRow>,
        report: RepairReport,
    ): Map<LocalDate, UUID> {
        val csvDates = results.map { it.date }.distinct().sorted()
        val existingByDate = raceRepository.findAll().groupBy { it.raceDate.toLocalDate() }
        val ambiguous = existingByDate.filterValues { it.size > 1 }.filterKeys { it in csvDates }
        check(ambiguous.isEmpty()) {
            "Several races share a csv date, so the results cannot be assigned unambiguously: " +
                ambiguous.entries.joinToString { "${it.key} (${it.value.size} races)" }
        }
        val resolved =
            csvDates.associateWith { date ->
                existingByDate[date]?.single()
                    ?: raceRepository
                        .save(RaceEntity(raceDate = date.atTime(ResultCsvReader.RACE_HOUR, 0), isPublished = true))
                        .also { report.racesCreated += "$date (${results.count { row -> row.date == date }} results)" }
            }
        report.racesMatched = resolved.size - report.racesCreated.size
        return resolved.mapValues { it.value.uuid }
    }

    private fun reloadRaces(raceUuidsByDate: Map<LocalDate, UUID>): Map<LocalDate, RaceEntity> {
        val byUuid = raceRepository.findAllById(raceUuidsByDate.values).associateBy { it.uuid }
        return raceUuidsByDate.mapValues { (_, uuid) -> byUuid.getValue(uuid) }
    }

    private fun upsertRunners(
        results: List<CsvResultRow>,
        runnerRows: List<CsvRunnerRow>,
        report: RepairReport,
    ): Map<String, RunnerEntity> {
        val existing = loadExistingRunners(report)
        val genders = csvGenders(results, runnerRows)
        val personalRecords = runnerRows.associate { it.name to it.personalRecord }
        val runners =
            genders.mapValues { (name, gender) ->
                val runner = existing[name]
                if (runner == null) {
                    report.runnersCreated += name
                    RunnerEntity(name = name, gender = gender, historicPersonalRecord = personalRecords[name], isVerified = true)
                } else {
                    applyCorrections(runner, gender, name in personalRecords, personalRecords[name], report)
                    runner
                }
            }
        existing
            .filterKeys { it !in genders }
            .forEach { (name, runner) -> report.runnersNotInCsv += "$name (${runner.uuid})" }
        return runnerRepository.saveAll(runners.values).associateBy { it.name }
    }

    private fun applyCorrections(
        runner: RunnerEntity,
        gender: Gender,
        hasCsvRecord: Boolean,
        personalRecord: Duration?,
        report: RepairReport,
    ) {
        var changed = false
        if (runner.gender != gender) {
            report.genderChanges += "${runner.name}: ${runner.gender} -> $gender"
            runner.gender = gender
            changed = true
        }
        if (hasCsvRecord && runner.historicPersonalRecord != personalRecord) {
            report.personalRecordChanges += "${runner.name}: ${runner.historicPersonalRecord} -> $personalRecord"
            runner.historicPersonalRecord = personalRecord
            changed = true
        }
        if (!runner.isVerified) {
            runner.isVerified = true
            changed = true
        }
        if (!changed) report.runnersUnchanged++
    }

    private fun loadExistingRunners(report: RepairReport): Map<String, RunnerEntity> {
        val byName = runnerRepository.findAll().groupBy { it.name }
        return byName.mapValues { (name, duplicates) ->
            if (duplicates.size > 1) {
                report.warnings +=
                    "$name exists ${duplicates.size} times in the runner table; " +
                    "keeping the one with the most results, the others are reported as not-in-csv"
            }
            duplicates.maxWith(compareBy({ it.races.size }, { it.uuid.toString() }))
        }
    }

    private fun csvGenders(
        results: List<CsvResultRow>,
        runnerRows: List<CsvRunnerRow>,
    ): Map<String, Gender> {
        val occurrences =
            results.map { it.name to it.gender } + runnerRows.map { it.name to it.gender }
        return occurrences
            .groupBy({ it.first }, { it.second })
            .mapValues { (_, genders) ->
                genders
                    .groupingBy { it }
                    .eachCount()
                    .maxBy { it.value }
                    .key
            }
    }

    private fun rebuildRaceRunners(
        results: List<CsvResultRow>,
        racesByDate: Map<LocalDate, RaceEntity>,
        runnersByName: Map<String, RunnerEntity>,
        report: RepairReport,
    ) {
        val history = raceRunnerRepository.findHistoryOutsideRaces(racesByDate.values.map { it.uuid })
        report.raceRunnersKept = history.size
        val timeline =
            (
                history.map { TimelineEntry(it.runnerUuid, it.raceDate.toLocalDate(), it.resultTime, null) } +
                    results.map { TimelineEntry(runnersByName.getValue(it.name).uuid, it.date, it.time, it) }
            ).sortedBy { it.date }

        val progress = mutableMapOf<UUID, RunnerProgress>()
        runnersByName.values.forEach { runner ->
            runner.historicPersonalRecord?.let { progress.getOrPut(runner.uuid) { RunnerProgress() }.personalRecord = it }
        }
        val rows = timeline.mapNotNull { entry -> advance(entry, progress, racesByDate, runnersByName) }
        raceRunnerRepository.saveAll(rows)
        report.raceRunnersInserted = rows.size
    }

    private fun advance(
        entry: TimelineEntry,
        progress: MutableMap<UUID, RunnerProgress>,
        racesByDate: Map<LocalDate, RaceEntity>,
        runnersByName: Map<String, RunnerEntity>,
    ): RaceRunnerEntity? {
        val state = progress.getOrPut(entry.runnerUuid) { RunnerProgress() }
        val year = entry.date.year
        val totalRaces = state.totalRaces + 1
        val seasonRaces = state.seasonRaces.getOrDefault(year, 0) + 1
        val row =
            entry.csvRow?.let { csvRow ->
                RaceRunnerEntity(
                    runner = runnersByName.getValue(csvRow.name),
                    race = racesByDate.getValue(entry.date),
                    // "Deltatt" rows have no recorded time; stored as null with hideTime = true.
                    resultTime = entry.time,
                    hideTime = entry.time == null,
                    previousPersonalRecord = state.personalRecord,
                    previousSeasonRecord = state.seasonRecords[year],
                    totalRaces = totalRaces,
                    seasonRaces = seasonRaces,
                )
            }
        entry.time?.let {
            state.personalRecord = state.personalRecord?.let { current -> minOf(current, it) } ?: it
            state.seasonRecords.merge(year, it, ::minOf)
        }
        state.totalRaces = totalRaces
        state.seasonRaces[year] = seasonRaces
        return row
    }
}
