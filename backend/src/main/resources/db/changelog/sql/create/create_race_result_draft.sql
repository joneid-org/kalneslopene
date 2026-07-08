CREATE TABLE race_result_draft
(
    race_uuid  UUID        NOT NULL,
    data       JSONB       NOT NULL,
    updated_at TIMESTAMP   NOT NULL,
    PRIMARY KEY (race_uuid),
    FOREIGN KEY (race_uuid) REFERENCES race (uuid) ON DELETE CASCADE
)
