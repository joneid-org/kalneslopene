create table file (
    uuid uuid primary key,
    url text not null,
    created_at timestamp not null,
    upload_confirmed_at timestamp
);

create table race_photo (
    race_uuid uuid not null,
    file_uuid uuid not null,
    primary key (race_uuid, file_uuid),
    foreign key (race_uuid) references race(uuid) on delete cascade,
    foreign key (file_uuid) references file(uuid) on delete cascade
);

create index race_photo_race_uuid_idx on race_photo (race_uuid);