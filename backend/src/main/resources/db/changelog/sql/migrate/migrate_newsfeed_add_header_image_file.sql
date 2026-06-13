ALTER TABLE newsfeed
    DROP COLUMN IF EXISTS header_image,
    ADD COLUMN IF NOT EXISTS header_image_uuid uuid REFERENCES file(uuid);
