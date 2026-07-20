alter table runner
    add column is_verified BOOLEAN;

alter table race
    add column is_published BOOLEAN;