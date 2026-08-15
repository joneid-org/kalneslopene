alter table organizer add column order_index double precision;

update organizer
set order_index = ordered.rn
from (
    select uuid, row_number() over (order by name) as rn
    from organizer
) ordered
where organizer.uuid = ordered.uuid;

alter table organizer alter column order_index set not null;

alter table organizer add constraint organizer_order_index_key unique (order_index);
