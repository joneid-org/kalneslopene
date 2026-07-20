create or replace view runner_stats as
select t.runner_uuid,
       min(t.race_time)   as personal_record,
       min(t.season_time) as season_record,
       sum(t.is_race)     as total_races,
       sum(case when t.season_time is not null then 1 else 0 end) as season_races
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

alter table race_runner
    add column season_races int;