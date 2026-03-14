INSERT INTO runner (uuid, name, gender)
SELECT
    gen_random_uuid(),
    'Runner ' || gs,
    CASE
        WHEN gs % 2 = 0 THEN 'Male'
        ELSE 'Female'
    END
FROM generate_series(1, 80) AS gs;