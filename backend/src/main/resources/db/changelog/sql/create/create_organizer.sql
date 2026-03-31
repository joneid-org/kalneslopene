CREATE TABLE organizer
(
    uuid           UUID PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    responsibility TEXT[],
    initials       VARCHAR(10)  NOT NULL,
    phone          VARCHAR(20),
    email          VARCHAR(255),
    contactPerson   BOOLEAN DEFAULT FALSE
);

