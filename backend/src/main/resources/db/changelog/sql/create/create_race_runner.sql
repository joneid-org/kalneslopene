CREATE TABLE race_runner
(
    runner_uuid           UUID NOT NULL ,
    race_uuid             UUID NOT NULL,
    result_time           TIME NOT NULL,
    hide_time             BOOLEAN NOT NULL,
    FOREIGN KEY (runner_uuid) REFERENCES runner(uuid) ON DELETE CASCADE,
    FOREIGN KEY (race_uuid) REFERENCES race(uuid) ON DELETE CASCADE,
    PRIMARY KEY (runner_uuid, race_uuid)

)