-- One row per race_runner entry with the runner's aggregates precomputed:
-- hidden and zero times are excluded from bests; historic (pre-digital) PRs
-- from runner.historic_personal_record count towards personal bests.
CREATE VIEW race_runner_stats AS
SELECT rr.runner_uuid,
       rr.race_uuid,
       (COUNT(*) OVER runner_races)::int AS total_races,
       LEAST(ru.historic_personal_record,
             MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
                 OVER runner_races) AS personal_best,
       MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
           OVER season_races AS season_best,
       LEAST(ru.historic_personal_record,
             MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
                 OVER earlier_races) AS previous_best,
       MIN(CASE WHEN NOT rr.hide_time AND rr.result_time > INTERVAL '0' THEN rr.result_time END)
           OVER earlier_season_races AS previous_season_best
FROM race_runner rr
         JOIN race r ON r.uuid = rr.race_uuid
         JOIN runner ru ON ru.uuid = rr.runner_uuid
WINDOW runner_races AS (PARTITION BY rr.runner_uuid),
       season_races AS (PARTITION BY rr.runner_uuid, EXTRACT(YEAR FROM r.race_date)),
       earlier_races AS (PARTITION BY rr.runner_uuid
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
       earlier_season_races AS (PARTITION BY rr.runner_uuid, EXTRACT(YEAR FROM r.race_date)
           ORDER BY r.race_date, rr.race_uuid
           ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING);
