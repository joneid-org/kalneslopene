WITH ranked_combinations AS (
    SELECT
        race_data.race_uuid,
        runner_data.runner_uuid,
        row_number() OVER (
            PARTITION BY race_data.race_uuid
            ORDER BY random()
        ) AS participant_rank,
        race_data.participant_target
    FROM (
        SELECT
            uuid AS race_uuid,
            30 + floor(random() * 21)::int AS participant_target
        FROM race
        WHERE race_date < TIMESTAMP '2026-04-01 00:00:00'
    ) AS race_data
    CROSS JOIN (
        SELECT uuid AS runner_uuid
        FROM runner
    ) AS runner_data
)
INSERT INTO race_runner (runner_uuid, race_uuid, result_time, hide_time)
SELECT
    runner_uuid,
    race_uuid,
    make_interval(
        hours => 0,
        mins => 22 + floor(random() * 50)::int,
        secs => floor(random() * 60)::int
    ),
    false
FROM ranked_combinations
WHERE participant_rank <= participant_target;