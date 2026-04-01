-- Migration: Change race_date to TIMESTAMP WITHOUT TIME ZONE for correct time handling
ALTER TABLE race
    ALTER COLUMN race_date TYPE TIMESTAMP WITHOUT TIME ZONE;

