-- Migration: add yr-populated wind direction (degrees, 0-360) to race weather.
ALTER TABLE race
    ADD COLUMN weather_wind_direction DOUBLE PRECISION;
