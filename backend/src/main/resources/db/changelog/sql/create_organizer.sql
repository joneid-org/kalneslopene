CREATE TABLE organizer
(
    uuid           UUID PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    responsibility VARCHAR(255) NOT NULL,
    initials       VARCHAR(10)  NOT NULL,
    phone          VARCHAR(20),
    email          VARCHAR(255)
);

