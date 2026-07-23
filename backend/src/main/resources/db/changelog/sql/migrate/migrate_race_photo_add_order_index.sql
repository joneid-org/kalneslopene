alter table race_photo add column order_index double precision;

update race_photo
set order_index = ordered.rn + 1
from (
    select race_uuid, file_uuid, row_number() over (partition by race_uuid order by random()) as rn
    from race_photo
) ordered
where race_photo.race_uuid = ordered.race_uuid
  and race_photo.file_uuid = ordered.file_uuid;

alter table race_photo alter column order_index set not null;

alter table race_photo add constraint race_photo_race_uuid_order_index_key unique (race_uuid, order_index);
