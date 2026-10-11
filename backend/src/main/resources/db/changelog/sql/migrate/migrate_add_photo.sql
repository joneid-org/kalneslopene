create table photo (
    uuid uuid primary key,
    photo_file_uuid uuid not null unique references file(uuid) on delete cascade,
    thumbnail_file_uuid uuid unique references file(uuid) on delete set null
);

insert into photo (uuid, photo_file_uuid)
select file_uuid, file_uuid from race_photo;

alter table race_photo drop constraint race_photo_file_uuid_fkey;
alter table race_photo rename column file_uuid to photo_uuid;
alter table race_photo add constraint race_photo_photo_uuid_fkey
    foreign key (photo_uuid) references photo(uuid) on delete cascade;
