INSERT INTO race (uuid, race_date, weather)
SELECT
    gen_random_uuid(),
    thursday_date + TIME '18:00',
    'Unknown'
FROM generate_series(
    DATE '2026-04-01',
    DATE '2026-12-31',
    INTERVAL '1 day'
) AS thursday_date
WHERE EXTRACT(DOW FROM thursday_date) = 4;