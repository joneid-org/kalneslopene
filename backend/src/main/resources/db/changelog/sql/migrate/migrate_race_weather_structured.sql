-- Migration: replace free-text race.weather with structured, yr-populated weather
-- fields plus a manual course-condition note and an admin-override lock.
ALTER TABLE race
    DROP COLUMN weather,
    ADD COLUMN course_condition        VARCHAR(255),
    ADD COLUMN weather_symbol          VARCHAR(64),
    ADD COLUMN weather_temperature     DOUBLE PRECISION,
    ADD COLUMN weather_wind_speed      DOUBLE PRECISION,
    ADD COLUMN weather_precipitation   DOUBLE PRECISION,
    ADD COLUMN weather_updated_at      TIMESTAMP,
    ADD COLUMN weather_manually_edited BOOLEAN NOT NULL DEFAULT FALSE;
