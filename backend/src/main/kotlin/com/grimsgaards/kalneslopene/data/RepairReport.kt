package com.grimsgaards.kalneslopene.data

import org.slf4j.Logger

class RepairReport {
    var racesMatched: Int = 0
    var racesCreated: MutableList<String> = mutableListOf()
    var raceRunnersDeleted: Int = 0
    var raceRunnersInserted: Int = 0
    var raceRunnersKept: Int = 0
    var runnersCreated: MutableList<String> = mutableListOf()
    var runnersUnchanged: Int = 0
    val genderChanges: MutableList<String> = mutableListOf()
    val personalRecordChanges: MutableList<String> = mutableListOf()
    val runnersNotInCsv: MutableList<String> = mutableListOf()
    val warnings: MutableList<String> = mutableListOf()

    fun log(
        log: Logger,
        dryRun: Boolean,
    ) {
        val mode = if (dryRun) "DRY RUN (rolled back)" else "APPLIED"
        log.info("=== CSV results repair — $mode ===")
        log.info("Races matched by date: $racesMatched, created: ${racesCreated.size}")
        racesCreated.forEach { log.info("  created race: $it") }
        log.info("race_runner rows deleted: $raceRunnersDeleted, inserted: $raceRunnersInserted")
        log.info("race_runner rows left untouched (races outside the csv dates): $raceRunnersKept")
        log.info(
            "Runners created: ${runnersCreated.size}, updated: ${genderChanges.size + personalRecordChanges.size}, unchanged: $runnersUnchanged",
        )
        logList(log, "Runners created", runnersCreated)
        logList(log, "Gender corrected", genderChanges)
        logList(log, "Historic personal record corrected", personalRecordChanges)
        logList(log, "Runners in db but not in csv (kept, review manually)", runnersNotInCsv)
        logList(log, "Warnings", warnings)
        if (dryRun) {
            log.warn("Dry run — nothing was committed. Set results-repair.dry-run=false to apply.")
        }
    }

    private fun logList(
        log: Logger,
        title: String,
        entries: List<String>,
    ) {
        if (entries.isEmpty()) return
        log.info("--- $title (${entries.size}) ---")
        entries.forEach { log.info("  $it") }
    }
}
