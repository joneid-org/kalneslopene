ALTER TABLE newsfeed
    ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;

UPDATE newsfeed SET published_at = date;
