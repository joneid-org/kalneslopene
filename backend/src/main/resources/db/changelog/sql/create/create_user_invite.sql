CREATE TABLE user_invite
(
    uuid       UUID PRIMARY KEY,
    roles      TEXT[]                   NOT NULL DEFAULT '{}'::text[],
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at    TIMESTAMP WITH TIME ZONE
);
