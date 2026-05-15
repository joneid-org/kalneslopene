alter table runner
    add column historic_personal_record INTERVAL;

create view personal_records as
select runner_uuid, min(time) as record
from ((select uuid as runner_uuid, historic_personal_record as time
       from runner)
      union
      (select runner_uuid, result_time as time from race_runner)) as t
group by runner_uuid;

alter table race_runner
    add column previous_personal_record INTERVAL;