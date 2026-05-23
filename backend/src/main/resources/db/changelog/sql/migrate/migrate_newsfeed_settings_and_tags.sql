CREATE TABLE newsfeed_settings
(
    id           SERIAL PRIMARY KEY,
    max_articles INT NOT NULL DEFAULT 10
);

INSERT INTO newsfeed_settings (max_articles) VALUES (10);

CREATE TABLE newsfeed_tag
(
    value VARCHAR(100) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    color VARCHAR(50)  NOT NULL
);
