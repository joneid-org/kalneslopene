package com.grimsgaards.kalneslopene.data

import com.grimsgaards.kalneslopene.runner.Gender
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.Duration
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ResultCsvReaderTest {
    @Nested
    inner class ReadRunners {
        private val runners = ResultCsvReader.readRunners()

        @Test
        fun `reads every row in the perser file`() {
            assertTrue(runners.size > 1000, "expected the full perser file, got ${runners.size} rows")
        }

        @Test
        fun `parses gender, name and mm ss personal record`() {
            val runner = runners.single { it.name == "Elise Stordal Aalerud" }
            assertEquals(Gender.FEMALE, runner.gender)
            assertEquals(Duration.ofMinutes(25).plusSeconds(31), runner.personalRecord)
        }

        @Test
        fun `has no duplicate names`() {
            val duplicates = runners.groupingBy { it.name }.eachCount().filterValues { it > 1 }
            assertTrue(duplicates.isEmpty(), "duplicate names in the perser file: ${duplicates.keys}")
        }
    }

    @Nested
    inner class ReadResults {
        private val results = ResultCsvReader.readResults()

        @Test
        fun `parses dd MM yy dates and returns rows sorted by date`() {
            assertEquals(results.map { it.date }.sorted(), results.map { it.date })
            assertEquals(LocalDate.of(2019, 4, 4), results.first().date)
        }

        @Test
        fun `covers every season from 2019 to 2026`() {
            assertEquals((2019..2026).toList(), results.map { it.date.year }.distinct().sorted())
        }

        @Test
        fun `reads a known result row`() {
            val row =
                results.single {
                    it.name == "Bjørn Erik Strangel" && it.date == LocalDate.of(2019, 12, 21)
                }
            assertEquals(Gender.MALE, row.gender)
            assertEquals(Duration.ofMinutes(21).plusSeconds(59), row.time)
        }

        @Test
        fun `keeps Deltatt rows with a null time`() {
            val participated = results.filter { it.time == null }
            assertTrue(participated.isNotEmpty(), "expected some Deltatt rows")
            assertNotNull(participated.first().name)
        }

        @Test
        fun `parses no time as null rather than zero`() {
            assertNull(results.firstOrNull { it.time == Duration.ZERO }?.time)
        }

        @Test
        fun `never has the same runner twice in one race`() {
            val duplicates =
                results
                    .groupingBy { it.name to it.date }
                    .eachCount()
                    .filterValues { it > 1 }
            assertTrue(duplicates.isEmpty(), "same runner twice in one race: ${duplicates.keys}")
        }

        @Test
        fun `gives every runner a single gender across all files`() {
            val conflicting =
                results
                    .groupBy { it.name }
                    .filterValues { rows -> rows.map { it.gender }.distinct().size > 1 }
            assertTrue(conflicting.isEmpty(), "conflicting genders: ${conflicting.keys}")
        }
    }
}
