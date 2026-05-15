CREATE TABLE users
(
    uuid     UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roles text[] NOT NULL DEFAULT '{}'::text[]
)
