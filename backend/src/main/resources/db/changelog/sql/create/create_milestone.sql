CREATE TABLE milestone
(
    uuid       UUID PRIMARY KEY,
    year       VARCHAR(10)  NOT NULL,
    icon       VARCHAR(50)  NOT NULL,
    title      VARCHAR(255) NOT NULL,
    summary    TEXT         NOT NULL,
    extra      TEXT,
    details    TEXT[]
);