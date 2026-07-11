alter table runner
    add column historic_season_record INTERVAL;
alter table race_runner
    add column previous_season_record INTERVAL;

drop view personal_records;

create index race_runner_race_idx on race_runner (race_uuid);

create or replace view runner_stats as
select t.runner_uuid,
       min(t.race_time)     as personal_record,
       min(t.season_time)   as season_record,
       sum(t.is_race)       as total_races
from ((select uuid                     as runner_uuid,
              historic_personal_record as race_time,
              null::interval           as season_time,
              0                        as is_race
       from runner)
      union all
      (select rr.runner_uuid,
              rr.result_time as race_time,
              case
                  when extract(year from r.race_date) = extract(year from current_date)
                      then rr.result_time
              end as season_time,
              1 as is_race
       from race_runner rr
                join race r on r.uuid = rr.race_uuid)) as t
group by t.runner_uuid;