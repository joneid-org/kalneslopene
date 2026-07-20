alter table race_runner
    alter column result_time drop not null;

alter table runner
    drop column historic_season_record;