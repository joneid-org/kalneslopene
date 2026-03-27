CREATE TABLE race
(
    uuid           UUID PRIMARY KEY,
    race_date       DATE    NOT NULL,
    race_time       TIMETZ     NOT NULL,
    weather         VARCHAR(255) NOT NULL
);

