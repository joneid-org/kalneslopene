package com.grimsgaards.kalneslopene.data

import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean
import org.springframework.core.Ordered
import org.springframework.core.annotation.AnnotationAwareOrderComparator
import org.springframework.core.io.ClassPathResource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class DataRunnerOrderTest {
    @Nested
    inner class BaselineBeforeRepair {
        private val properties =
            YamlPropertiesFactoryBean()
                .apply { setResources(ClassPathResource("application.yml")) }
                .getObject()!!

        private fun order(key: String): Int = assertNotNull(properties.getProperty(key), "$key is missing from application.yml").toInt()

        @Test
        fun `both runners take their order from configuration`() {
            listOf(BaselineDataGenerator::class.java, CsvResultsRepair::class.java).forEach { type ->
                assertTrue(
                    Ordered::class.java.isAssignableFrom(type),
                    "${type.simpleName} must implement Ordered; @Order cannot hold a property placeholder",
                )
            }
        }

        @Test
        fun `the configured baseline order is ahead of the repair`() {
            assertTrue(
                order("ordering.baseline") < order("ordering.repair"),
                "the baseline must be seeded before the repair rebuilds it",
            )
        }

        @Test
        fun `spring sorts by the configured order regardless of discovery order`() {
            val discovered =
                listOf(
                    OrderedStub(CsvResultsRepair::class.java, order("ordering.repair")),
                    OrderedStub(BaselineDataGenerator::class.java, order("ordering.baseline")),
                )
            val sorted = discovered.sortedWith(AnnotationAwareOrderComparator.INSTANCE)
            assertEquals(
                listOf(BaselineDataGenerator::class.java, CsvResultsRepair::class.java),
                sorted.map { it.type },
            )
        }
    }

    /** Stands in for the real bean, which cannot be built without its repositories. */
    private class OrderedStub(
        val type: Class<*>,
        private val order: Int,
    ) : Ordered {
        override fun getOrder(): Int = order
    }
}
