# results-repair

One-off repair that rebuilds `runner` and `race_runner` from the corrected `Resultater/v2` csv files,
for a database that was already populated from the earlier, faulty csvs.

It is a `CommandLineRunner` (`data/CsvResultsRepair.kt`) that runs once at startup when it is switched
on, entirely inside one transaction. It is separate from `BaselineDataGenerator`, which is untouched
and still only seeds an empty database.

## What it touches

| Table | What happens |
| --- | --- |
| `race_runner` | Rows for races on a csv date are **deleted and rebuilt** from the csvs. Rows for any other race are left alone. |
| `runner` | Matched by name. Gender, historic personal record and `is_verified` are corrected; missing runners are created. Nothing is deleted. |
| `race` | Only read, plus an insert when a csv date has no race at all. Existing races are never updated or deleted. |

Weather, course condition, photos and `is_published` on existing races are never written to, so a race
keeps its weather entries even when all of its results are replaced.

A csv date with no matching race gets a new race at 18:00, published, with the weather columns left
null — the same shape `BaselineDataGenerator` creates. Every created race is listed in the report.

Runners that exist in the database but appear in no csv (leftovers from a name that has since been
corrected, or manually added ones) are **reported and kept**, never deleted. Review them by hand
afterwards; a runner attached only to races outside the csv dates keeps working untouched.

## Derived columns

`previous_personal_record`, `previous_season_record`, `total_races` and `season_races` are snapshots
taken at the time of each race, so they are recomputed by replaying every runner's races in date
order. The replay also includes the runner's published races **outside** the csv dates, so those
still count towards the totals — but the rows for those races are not themselves rewritten, so their
own stored totals can be left stale if a rebuilt race is inserted before them chronologically. The
report prints how many such rows were left untouched.

Unpublished races are excluded from the replay, matching the `runner_stats` view.

## Aborts before writing anything if

- the same runner appears twice on one date in the csvs (would violate the `race_runner` primary key)
- two races in the database share a csv date, so results cannot be assigned unambiguously

Conflicting genders for one name across the csvs is a warning, not an abort — the most frequent
gender wins. Duplicate names inside the `runner` table are also a warning: the runner with the most
results is kept as the match, and the others show up in the not-in-csv list.

## Running it

Settings live in `backend/src/main/resources/application.yml`:

```yaml
results-repair:
  enabled: false
  dry-run: true
```

`dry-run: true` does the whole rebuild, logs the full report, then rolls the transaction back — nothing
is committed. Always do this first and read the report.

Locally, against a database restored from a prod dump:

```bash
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local --results-repair.enabled=true'
```

Then apply for real:

```bash
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local --results-repair.enabled=true --results-repair.dry-run=false'
```

Against prod, set the environment variables on the Dokploy app rather than editing the yaml, redeploy
once, read the logs, then unset them and redeploy again so the repair does not run on every boot:

```
RESULTS_REPAIR_ENABLED=true
RESULTS_REPAIR_DRY_RUN=true
```

Take a database dump first — the repair replaces every result row for the csv dates in one shot.
`scripts/pgtunnel.sh` opens a tunnel if you want to dump or inspect prod from your machine.

## Report

Logged at `INFO` under `CsvResultsRepair` when the run finishes:

- races matched by date, and every race created
- `race_runner` rows deleted, inserted, and left untouched
- runners created, and every gender / historic personal record correction with old and new value
- runners in the database but not in any csv, with their uuid
- warnings (gender conflicts, duplicate runner names)
