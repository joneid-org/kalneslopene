package com.grimsgaards.kalneslopene.data

import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.AnnotationAwareOrderComparator
import org.springframework.core.annotation.AnnotationUtils
import org.springframework.core.annotation.Order
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class DataRunnerOrderTest {
    @Nested
    inner class BaselineBeforeRepair {
        @Test
        fun `both runners declare an explicit order`() {
            listOf(BaselineDataGenerator::class.java, CsvResultsRepair::class.java).forEach { type ->
                assertNotNull(
                    AnnotationUtils.findAnnotation(type, Order::class.java),
                    "${type.simpleName} has no @Order, so Spring Boot would run it at LOWEST_PRECEDENCE",
                )
            }
        }

        @Test
        fun `spring sorts the baseline first regardless of discovery order`() {
            val discovered =
                listOf<CommandLineRunner>(
                    CsvResultsRepair::class.java.stub(),
                    BaselineDataGenerator::class.java.stub(),
                )
            val sorted = discovered.sortedWith(AnnotationAwareOrderComparator.INSTANCE)
            assertEquals(
                listOf(BaselineDataGenerator::class.java, CsvResultsRepair::class.java),
                sorted.map { (it as OrderedStub).type },
            )
        }
    }

    /** Stands in for the real bean: the comparator only reads the `@Order` of the annotated type. */
    private class OrderedStub(
        val type: Class<*>,
    ) : CommandLineRunner,
        org.springframework.core.Ordered {
        override fun getOrder(): Int = AnnotationUtils.findAnnotation(type, Order::class.java)!!.value

        override fun run(vararg args: String) = Unit
    }

    private fun Class<*>.stub(): CommandLineRunner = OrderedStub(this)
}
