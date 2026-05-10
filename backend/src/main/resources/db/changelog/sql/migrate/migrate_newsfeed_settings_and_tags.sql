CREATE TABLE newsfeed_settings
(
    id           SERIAL PRIMARY KEY,
    max_articles INT NOT NULL DEFAULT 10
);

INSERT INTO newsfeed_settings (max_articles) VALUES (10);

CREATE TABLE newsfeed_tag
(
    uuid  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50)  NOT NULL DEFAULT 'bg-black'
);

INSERT INTO newsfeed_tag (label, value, color) VALUES
    ('Resultater',   'resultater',   'bg-blue-600'),
    ('Bilder',       'bilder',       'bg-purple-600'),
    ('Kommende løp', 'kommende løp', 'bg-green-600'),
    ('Ukens løp',    'ukens løp',    'bg-orange-500');

