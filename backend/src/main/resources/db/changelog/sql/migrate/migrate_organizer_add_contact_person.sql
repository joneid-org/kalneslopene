alter table organizer
    add column contactPerson BOOLEAN DEFAULT FALSE;

create index idx_milestone_year
    on milestone (year);
