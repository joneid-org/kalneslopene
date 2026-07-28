alter table race_runner
    drop constraint race_runner_runner_uuid_fkey;

alter table race_runner
    add constraint race_runner_runner_uuid_fkey
        foreign key (runner_uuid) references runner (uuid);
