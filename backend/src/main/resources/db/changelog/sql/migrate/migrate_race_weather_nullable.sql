-- Migration: Make weather column nullable in race table
ALTER TABLE race
    ALTER COLUMN weather DROP NOT NULL;

