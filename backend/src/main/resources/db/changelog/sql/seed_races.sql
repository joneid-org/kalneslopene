INSERT INTO race (uuid, race_date, weather)
SELECT
    gen_random_uuid(),
    TIMESTAMP '2026-01-08 18:00:00' + ((gs - 1) * INTERVAL '7 days'),
    CASE (gs % 8)
        WHEN 0 THEN 'Sol,Varmt'
        WHEN 1 THEN 'Overskyet'
        WHEN 2 THEN 'Vind,Overskyet'
        WHEN 3 THEN 'Regn,Kaldt'
        WHEN 4 THEN 'Sol'
        WHEN 5 THEN 'Tåke,Kaldt'
        WHEN 6 THEN 'Storm,Regn'
        ELSE 'Snø,Kaldt'
    END
FROM generate_series(1, 12) AS gs;