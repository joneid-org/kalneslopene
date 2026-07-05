-- One row per race_runner entry with the runner's aggregates precomputed AS OF that race:
-- stats never include races that happened after the row's own race (a PR set in a later race
-- must not leak into earlier races). Hidden and zero times are excluded from bests; historic
-- (pre-digital) PRs from runner.historic_personal_record count towards personal bests.
CREATE OR REPLACE VIEW race_runner_stats AS
SELECT rr.runner_uuid,
       rr.race_uuid,
       (COUNT(*) OVER through_races)::int AS total_races,
       LEAST(ru.historic_personal_record,
             MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
                 OVER through_races) AS personal_best,
       MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
           OVER through_season_races AS season_best,
       LEAST(ru.historic_personal_record,
             MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
                 OVER earlier_races) AS previous_best,
       MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
           OVER earlier_season_races AS previous_season_best
FROM race_runner rr
         JOIN race r ON r.uuid = rr.race_uuid
         JOIN runner ru ON ru.uuid = rr.runner_uuid
WINDOW through_races AS (PARTITION BY rr.runner_uuid
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
       through_season_races AS (PARTITION BY rr.runner_uuid, EXTRACT(YEAR FROM r.race_date)
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
       earlier_races AS (PARTITION BY rr.runner_uuid
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
       earlier_season_races AS (PARTITION BY rr.runner_uuid, EXTRACT(YEAR FROM r.race_date)
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING);
