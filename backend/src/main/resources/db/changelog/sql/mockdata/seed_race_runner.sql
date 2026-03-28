-- Seed race_runner for all past races (b1..b27).
-- Each race gets a realistic random subset of runners with finish times.
-- result_time is stored as INTERVAL, hide_time = false for all.

INSERT INTO race_runner (runner_uuid, race_uuid, result_time, hide_time)
SELECT
    r.uuid AS runner_uuid,
    ra.uuid AS race_uuid,
    (INTERVAL '22 minutes' + (floor(random() * 50) || ' minutes')::INTERVAL
        + (floor(random() * 60) || ' seconds')::INTERVAL) AS result_time,
    false
FROM race ra
CROSS JOIN runner r
WHERE ra.race_date < CURRENT_DATE
  AND random() < 0.75;

