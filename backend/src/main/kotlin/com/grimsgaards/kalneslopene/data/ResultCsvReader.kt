package com.grimsgaards.kalneslopene.data

import com.grimsgaards.kalneslopene.runner.Gender
import org.springframework.core.io.ClassPathResource
import java.time.Duration
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class CsvRunnerRow(
    val gender: Gender,
    val name: String,
    val personalRecord: Duration?,
)

data class CsvResultRow(
    val gender: Gender,
    val name: String,
    val time: Duration?,
    val date: LocalDate,
)

/**
 * Reads the `Resultater/v2` result files. They are semicolon separated, with `mm:ss` times
 * ("Deltatt" when the runner finished without a recorded time) and `dd/MM/yy` dates.
 */
object ResultCsvReader {
    fun readRunners(): List<CsvRunnerRow> =
        readCsv(PERSER_FILE).mapNotNull { cols ->
            val gender = parseGender(cols.getOrNull(0)) ?: return@mapNotNull null
            val name = cols.getOrNull(1)?.trim().orEmpty()
            if (name.isEmpty()) return@mapNotNull null
            CsvRunnerRow(gender, name, parseTime(cols.getOrNull(2)))
        }

    fun readResults(): List<CsvResultRow> =
        RESULT_FILES
            .flatMap { file ->
                readCsv(file).mapNotNull { cols ->
                    val gender = parseGender(cols.getOrNull(0)) ?: return@mapNotNull null
                    val name = cols.getOrNull(1)?.trim().orEmpty()
                    if (name.isEmpty()) return@mapNotNull null
                    val date = parseDate(cols.getOrNull(3)) ?: return@mapNotNull null
                    CsvResultRow(gender, name, parseTime(cols.getOrNull(2)), date)
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

    const val RACE_HOUR = 18
    private const val PERSER_FILE = "Resultater/v2/Perser_2018.csv"
    private val RESULT_FILES = (2019..2026).map { "Resultater/v2/Resultater_$it.csv" }
    private val TIME_REGEX = Regex("""(\d+):(\d{2})""")
    private val DATE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yy")
}
