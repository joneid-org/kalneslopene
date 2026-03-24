CREATE TABLE newsfeed
(
    uuid    UUID PRIMARY KEY,
    tags    TEXT[],
    header  VARCHAR(255) NOT NULL,
    content TEXT         NOT NULL,
    date    TIMESTAMP    NOT NULL
);

