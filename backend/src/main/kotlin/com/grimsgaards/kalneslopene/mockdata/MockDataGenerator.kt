package com.grimsgaards.kalneslopene.mockdata

import com.grimsgaards.kalneslopene.common.logger
import com.grimsgaards.kalneslopene.model.dto.Gender
import com.grimsgaards.kalneslopene.model.entities.MilestoneEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedEntity
import com.grimsgaards.kalneslopene.model.entities.NewsfeedTagEntity
import com.grimsgaards.kalneslopene.model.entities.OrganizerEntity
import com.grimsgaards.kalneslopene.model.entities.RaceEntity
import com.grimsgaards.kalneslopene.model.entities.RaceRunnerEntity
import com.grimsgaards.kalneslopene.model.entities.RunnerEntity
import com.grimsgaards.kalneslopene.repository.MilestoneRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedRepository
import com.grimsgaards.kalneslopene.repository.NewsfeedTagRepository
import com.grimsgaards.kalneslopene.repository.OrganizerRepository
import com.grimsgaards.kalneslopene.repository.RaceRepository
import com.grimsgaards.kalneslopene.repository.RaceRunnerRepository
import com.grimsgaards.kalneslopene.repository.RunnerRepository
import com.grimsgaards.kalneslopene.service.WeatherServiceMock
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.DayOfWeek
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.temporal.TemporalAdjusters
import java.util.UUID
import kotlin.random.Random

@Component
@ConditionalOnProperty(prefix = "mockdata", name = ["enabled"], havingValue = "true", matchIfMissing = false)
class MockDataGenerator(
    private val runnerRepository: RunnerRepository,
    private val raceRepository: RaceRepository,
    private val raceRunnerRepository: RaceRunnerRepository,
    private val newsfeedTagRepository: NewsfeedTagRepository,
    private val newsfeedRepository: NewsfeedRepository,
    private val organizerRepository: OrganizerRepository,
    private val milestoneRepository: MilestoneRepository,
) : CommandLineRunner {
    private val log = logger()
    private val random = Random(RANDOM_SEED)

    @Transactional
    override fun run(vararg args: String) {
        if (runnerRepository.count() > 0) {
            log.info("Mock data already present, skipping generation")
            return
        }
        log.info("Generating mock data...")
        val runners = generateRunners()
        val pastRaces = generateRaces()
        generateRaceRunners(runners, pastRaces)
        generateNewsfeed()
        generateOrganizers()
        generateMilestones()
        log.info("Generated ${runners.size} runners and ${pastRaces.size} past races with results")
    }

    private fun generateRunners(): List<RunnerEntity> =
        runnerRepository.saveAll(
            runnerSeed.map { (name, gender) -> RunnerEntity(name = name, gender = gender, isVerified = true) },
        )

    private fun generateRaces(): List<RaceEntity> {
        val now = LocalDateTime.now()
        val raceTime = LocalTime.of(RACE_HOUR, 0)
        var lastPast = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.THURSDAY)).atTime(raceTime)
        if (!lastPast.isBefore(now)) lastPast = lastPast.minusWeeks(1)

        val pastRaces =
            (0 until PAST_RACES)
                .map { lastPast.minusWeeks(it.toLong()) }
                .reversed()
                .map { RaceEntity(raceDate = it, isPublished = Random.nextInt(100) > 10).also { race -> applyMockWeather(race) }  }
        val upcomingRaces =
            (1..UPCOMING_RACES).map { RaceEntity(raceDate = lastPast.plusWeeks(it.toLong()), isPublished = false) }

        return raceRepository.saveAll(pastRaces + upcomingRaces).filter { it.raceDate.isBefore(now) }
    }

    private fun applyMockWeather(race: RaceEntity) {
        val weather = WeatherServiceMock.randomWeather(random)
        race.weatherSymbol = weather.symbol
        race.weatherTemperature = weather.temperature
        race.weatherWindSpeed = weather.windSpeed
        race.weatherPrecipitation = weather.precipitation
        race.weatherUpdatedAt = race.raceDate.atZone(OSLO_ZONE).toInstant()
        if (random.nextDouble() < COURSE_CONDITION_CHANCE) race.courseCondition = MOCK_COURSE_CONDITIONS.random(random)
    }

    private fun generateRaceRunners(
        runners: List<RunnerEntity>,
        pastRaces: List<RaceEntity>,
    ) {
        // The runner_stats view is not usable mid-transaction, so track the records here.
        val personalRecords = mutableMapOf<UUID, Duration>()
        val seasonRecords = mutableMapOf<Pair<UUID, Int>, Duration>()
        val raceCounts = mutableMapOf<UUID, Int>()
        val seasonRaceCounts = mutableMapOf<Pair<UUID, Int>, Int>()
        val raceRunners =
            pastRaces.flatMap { race ->
                runners
                    .filter { random.nextDouble() < PARTICIPATION_RATE }
                    .map { runner ->
                        val time = randomResultTime()
                        val seasonKey = runner.uuid to race.raceDate.year
                        val totalRaces = raceCounts.getOrDefault(runner.uuid, 0) + 1
                        val seasonRaces = seasonRaceCounts.getOrDefault(seasonKey, 0) + 1
                        val raceRunner =
                            RaceRunnerEntity(
                                runner = runner,
                                race = race,
                                resultTime = time,
                                previousPersonalRecord = personalRecords[runner.uuid],
                                previousSeasonRecord = seasonRecords[seasonKey],
                                totalRaces = totalRaces,
                                seasonRaces = seasonRaces,
                            )
                        personalRecords.merge(runner.uuid, time, ::minOf)
                        seasonRecords.merge(seasonKey, time, ::minOf)
                        raceCounts[runner.uuid] = totalRaces
                        seasonRaceCounts[seasonKey] = seasonRaces
                        raceRunner
                    }
            }
        raceRunnerRepository.saveAll(raceRunners)
    }

    private fun randomResultTime(): Duration =
        Duration
            .ofMinutes(BASE_MINUTES)
            .plusMinutes(random.nextInt(EXTRA_MINUTES_BOUND).toLong())
            .plusSeconds(random.nextInt(SECONDS_BOUND).toLong())

    private fun generateNewsfeed() {
        newsfeedTagRepository.saveAll(newsfeedTagSeed)
        newsfeedRepository.saveAll(newsfeedSeed)
    }

    private fun generateOrganizers() {
        organizerRepository.saveAll(organizerSeed)
    }

    private fun generateMilestones() {
        milestoneRepository.saveAll(milestoneSeed)
    }

    private fun osloTime(isoLocal: String): OffsetDateTime =
        LocalDateTime.parse(isoLocal).atZone(ZoneId.of("Europe/Oslo")).toOffsetDateTime()

    private val runnerSeed: List<Pair<String, Gender>> =
        listOf(
            "Erik Solberg" to Gender.MALE,
            "Lars Haugen" to Gender.MALE,
            "Tor Kristiansen" to Gender.MALE,
            "Morten Bakke" to Gender.MALE,
            "Jonas Andersen" to Gender.MALE,
            "Henrik Nilsen" to Gender.MALE,
            "Ola Mæland" to Gender.MALE,
            "Per Johnsen" to Gender.MALE,
            "Bjørn Lie" to Gender.MALE,
            "Knut Holm" to Gender.MALE,
            "Sigurd Berg" to Gender.MALE,
            "Frode Dahl" to Gender.MALE,
            "Andreas Vold" to Gender.MALE,
            "Geir Lunde" to Gender.MALE,
            "Trond Svensson" to Gender.MALE,
            "Anne Berge" to Gender.FEMALE,
            "Kari Moen" to Gender.FEMALE,
            "Ingrid Fossum" to Gender.FEMALE,
            "Silje Strand" to Gender.FEMALE,
            "Hanne Pettersen" to Gender.FEMALE,
            "Lise Thorsen" to Gender.FEMALE,
            "Tone Aaberg" to Gender.FEMALE,
            "Marte Lindgren" to Gender.FEMALE,
            "Ida Kvam" to Gender.FEMALE,
            "Kristin Ruud" to Gender.FEMALE,
        )

    private val newsfeedTagSeed: List<NewsfeedTagEntity> =
        listOf(
            NewsfeedTagEntity("Resultater", "#2563EB"),
            NewsfeedTagEntity("Bilder", "#9333EA"),
            NewsfeedTagEntity("Kommende løp", "#16A34A"),
            NewsfeedTagEntity("Ukens løp", "#F97316"),
        )

    @Suppress("ktlint:standard:max-line-length")
    private val newsfeedSeed: List<NewsfeedEntity> =
        listOf(
            NewsfeedEntity(
                tags = listOf("resultater", "vinter"),
                header = "Flott gjennomføring tross snø og kulde",
                content = "Torsdag kveld samlet 22 løpere seg til årets første vinterløp på Kalnesletta. Til tross for minusgrader og snødekke leverte deltakerne imponerende tider. Erik Solberg tok seieren på 24:32, tett fulgt av Lars Haugen på 24:58. Blant kvinnene vant Kari Moen suverent på 28:14. Takk til alle fremmøtte – vi sees igjen neste torsdag!",
                date = osloTime("2026-03-19T19:30:00"),
            ),
            NewsfeedEntity(
                tags = listOf("jubileum", "rekord"),
                header = "100. løp i rekken – en merkedag for Kalneslåpene!",
                content = "I kveld ble det løpt det 100. Kalneslåpet siden starten i 2022. Det ble markert med kake, diplomer til alle deltakere og en ekstra spesiell stemning i mørket. Jonas Andersen, som har deltatt på samtlige 100 løp, ble hyllet av de fremmøtte. En stor takk til alle som har vært med på reisen!",
                date = osloTime("2026-03-12T20:00:00"),
            ),
            NewsfeedEntity(
                tags = listOf("resultater", "vår"),
                header = "Vårens første løp – strålende vær og ny deltakelsesrekord",
                content = "Med 38 påmeldte satte vi ny deltakelsesrekord denne torsdagen. Solen skinte og temperaturen var perfekt for løping. Trond Svensson satte personlig rekord med 26:01, mens Ingrid Fossum knuste sin tidligere beste tid med over to minutter. Neste uke er det klart for løp nummer to i vårsesongen.",
                date = osloTime("2026-03-05T19:45:00"),
            ),
            NewsfeedEntity(
                tags = listOf("info", "sesong"),
                header = "Kalneslåpene 2026 – sesongprogram klart",
                content = "Vi er glade for å presentere sesongprogrammet for vår/sommer 2026! Løpene arrangeres hver torsdag kl. 18:00 fra Kalneshallen. Sesongen starter 26. mars og går til og med 18. juni. Alle er velkomne – enten du er nybegynner eller erfaren løper. Påmelding er ikke nødvendig, bare møt opp!",
                date = osloTime("2026-02-28T12:00:00"),
            ),
            NewsfeedEntity(
                tags = listOf("resultater", "vinter"),
                header = "Tett løp i snøføyken – Haugen og Moen tok seieren",
                content = "Tross dårlig sikt og glatt underlag stilte 18 dedikerte løpere til start torsdag kveld. Lars Haugen vant herrefeltet på 25:44, mens Kari Moen nok en gang dominerte damefeltet med 29:02. Arrangørene berømmer alle for godt humør og sterk innsats under krevende forhold.",
                date = osloTime("2026-02-26T20:15:00"),
            ),
            NewsfeedEntity(
                tags = listOf("info", "utstyr"),
                header = "Tips til vinterlysrunden: kles deg riktig!",
                content = "Med mørke og kalde kvelder er det viktig å være godt forberedt. Vi anbefaler pannebåndlampe, refleksvest og brodder ved glatte forhold. Husk også å melde fra til noen om du løper alene. Arrangørene stiller alltid opp med førstehjelpskoffert og varm drikke ved målgang.",
                date = osloTime("2026-01-20T10:00:00"),
            ),
            NewsfeedEntity(
                tags = listOf("resultater", "høst"),
                header = "Høstens siste løp – fin avslutning på sesongen",
                content = "Med fargerike løv og frisk høstluft ble sesongavslutningen en suksess. 31 løpere fullførte, og stemningen var festlig. Henrik Nilsen overrasket med årets raskeste tid på 23:58 – et løp han vil huske lenge. Neste sesong starter i januar – følg med på nettsiden for oppdateringer.",
                date = osloTime("2025-11-27T20:30:00"),
            ),
            NewsfeedEntity(
                tags = listOf("info", "frivillig"),
                header = "Bli med som frivillig arrangør!",
                content = "Kalneslåpene drives av frivillige, og vi trenger alltid flere hender. Som arrangør hjelper du til med registrering, tidtaking og å henge opp merking langs løypa. Det tar ca. 2 timer per kveld og er en hyggelig måte å bidra på. Ta kontakt med oss på e-post eller møt opp en torsdag kveld.",
                date = osloTime("2025-10-15T09:00:00"),
            ),
            NewsfeedEntity(
                tags = listOf("resultater", "høst"),
                header = "Rekordoppmøte: 41 løpere i høstmørket",
                content = "Aldri før har så mange stilt til start på Kalneslåpene. 41 løpere fullførte torsdagens løp, og vi måtte improvisere med ekstra startnumre. Silje Strand var raskeste dame på 27:33, og Bjørn Lie vant herrefeltet med en sterk 24:11. Fantastisk gjeng!",
                date = osloTime("2025-10-02T21:00:00"),
            ),
            NewsfeedEntity(
                tags = listOf("info", "sesong"),
                header = "Sesongstart høst 2025 – velkommen tilbake!",
                content = "Etter en herlig sommerpause er Kalneslåpene tilbake! Første løp i høstsesongen arrangeres torsdag 4. september kl. 18:00. Vi gleder oss til å se kjente og nye ansikter. Løypa er den samme som alltid – ca. 5 km langs de vakre omgivelsene på Kalnesletta. Vel møtt!",
                date = osloTime("2025-09-01T08:00:00"),
            ),
        )

    private val organizerSeed: List<OrganizerEntity> =
        listOf(
            OrganizerEntity(
                name = "Emilie Nilsen",
                responsibility = listOf("Leder", "Påmelding", "Kommunikasjon"),
                initials = "EN",
                phone = "97654321",
                email = "emilie@kalneslopene.no",
                contactperson = true,
            ),
            OrganizerEntity(
                name = "Magnus Holm",
                responsibility = listOf("Tidtaking", "Resultater"),
                initials = "MH",
                phone = "91234567",
                email = "magnus@kalneslopene.no",
                contactperson = false,
            ),
            OrganizerEntity(
                name = "Turid Bakken",
                responsibility = listOf("Løypemerking", "Sikkerhet"),
                initials = "TB",
                phone = "98765432",
                email = null,
                contactperson = false,
            ),
            OrganizerEntity(
                name = "Rune Sørensen",
                responsibility = listOf("Utstyr", "Teknisk ansvarlig"),
                initials = "RS",
                phone = "90123456",
                email = "rune@kalneslopene.no",
                contactperson = false,
            ),
            OrganizerEntity(
                name = "Astrid Lien",
                responsibility = listOf("Sosiale medier", "Fotografering"),
                initials = "AL",
                phone = null,
                email = "astrid@kalneslopene.no",
                contactperson = false,
            ),
        )

    @Suppress("ktlint:standard:max-line-length")
    private val milestoneSeed: List<MilestoneEntity> =
        listOf(
            MilestoneEntity(
                year = "1978",
                icon = "Flag",
                title = "Den spede begynnelsen",
                summary = "Torsdagsløpet starter som et prøveløp, initiert av Bjørn Paulsrud, Ivar Andersen og Eivind Storbugt. Det var Bedriftsidretten som stod som arrangør.",
                extra = "Bjørn Paulsrud regnes som Torsdagsløpets grunnlegger. Han var ikke bare en løpsorganisator, men hadde også stor omsorg for løperne. Han ledet Torsdagsløpet fra starten i 1978 til sin død i 2010, da Per Prøitz tok over.",
                details = listOf("Grunnleggere:Paulsrud, Andersen, Storbugt", "Arrangør:Bedriftsidretten", "Format:Ukentlig prøveløp"),
            ),
            MilestoneEntity(
                year = "1981",
                icon = "Users",
                title = "Omtalt i Sarpsborg Arbeiderblad",
                summary = "Løpet får sin første avisomtale i Sarpsborg Arbeiderblad. Populariteten øker raskt på 80-tallet, og verken varme eller regn holder deltakerne hjemme.",
                extra = "Selv tropevarmen i august 1982, med opp mot 35 grader, stoppet ikke trimmerne. Løpet samlet deltakere i alle aldre, og torsdagsløperne skulket aldri.",
                details = listOf("Første omtale:17. juli 1981 SA", "Journalist:Aslak Andresen", "Deltakere:Alle aldre"),
            ),
            MilestoneEntity(
                year = "1986",
                icon = "Trophy",
                title = "Frivillige hylles",
                summary = "Frivillige som stod for den praktiske gjennomføringen fikk fullt fortjent SA-kaka etter avsluttet sesong. Løpet var svært populært midt på 80-tallet.",
                extra = "Det kreves alltid frivillige til den praktiske gjennomføringen av hvert løp. I 1986 fikk disse fullt fortjent anerkjennelse etter en vellykket sesong.",
                details = listOf("Arrangør:Bedriftsidretten", "Frivillige hyllet:SA-kaka", "Deltakelse:Rekordmange på 80-tallet"),
            ),
            MilestoneEntity(
                year = "1987",
                icon = "MapPin",
                title = "Kalnesskogen trues",
                summary = "Engasjementet rundt Kalnesskogen blusser opp. Kommunen ønsker å legge ut deler av skogen til næring, og avfall dumpes langs Gamle Kongevei.",
                extra = "Denne saken er relevant den dag i dag. I dag er det svært lite avfall å se i selve løypenettet, men noen synes fremdeles det er enklere å dumpe søppel langs veien.",
                details = listOf("Trussel:Næringsareal i skogen", "Problem:Søppeldumping", "SA-artikkel:22. august 1987"),
            ),
            MilestoneEntity(
                year = "2010",
                icon = "Calendar",
                title = "Bjørn Paulsrud går bort",
                summary = "Løpets grunnlegger og sjel, Bjørn Paulsrud, går bort etter å ha ledet Torsdagsløpet siden 1978. Per Prøitz overtar ledelsen.",
                extra = "Bjørn Paulsrud har fått en del av blåløypa oppkalt etter seg — Paulsrudholtet — mellom 1,7 og 1,9 km. Hans omsorg for løperne preget Torsdagsløpet i over 30 år.",
                details = listOf("Leder 1978–2010:Bjørn Paulsrud", "Ny leder:Per Prøitz", "Minnesmerke:Paulsrudholtet blåløypa"),
            ),
        )

    companion object {
        private const val RANDOM_SEED = 42L
        private const val PAST_RACES = 128
        private const val UPCOMING_RACES = 12
        private const val RACE_HOUR = 18
        private const val BASE_MINUTES = 22L
        private const val EXTRA_MINUTES_BOUND = 50
        private const val SECONDS_BOUND = 60
        private const val PARTICIPATION_RATE = 0.75
        private const val COURSE_CONDITION_CHANCE = 0.5
        private val OSLO_ZONE: ZoneId = ZoneId.of("Europe/Oslo")
        private val MOCK_COURSE_CONDITIONS = listOf("Tørt", "Vått", "Gjørmete", "Isete", "Løvdekt")
    }
}
