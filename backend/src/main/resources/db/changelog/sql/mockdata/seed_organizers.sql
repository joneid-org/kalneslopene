INSERT INTO organizer (uuid, name, responsibility, initials, phone, email, contactperson) VALUES
(
    'd1000000-0000-0000-0000-000000000001',
    'Emilie Nilsen',
    ARRAY['Leder', 'Påmelding', 'Kommunikasjon'],
    'EN',
    '97654321',
    'emilie@kalneslopene.no',
 true
),
(
    'd1000000-0000-0000-0000-000000000002',
    'Magnus Holm',
    ARRAY['Tidtaking', 'Results'],
    'MH',
    '91234567',
    'magnus@kalneslopene.no',
 false
),
(
    'd1000000-0000-0000-0000-000000000003',
    'Turid Bakken',
    ARRAY['Løypemerking', 'Sikkerhet'],
    'TB',
    '98765432',
    NULL,
 false
),
(
    'd1000000-0000-0000-0000-000000000004',
    'Rune Sørensen',
    ARRAY['Utstyr', 'Teknisk ansvarlig'],
    'RS',
    '90123456',
    'rune@kalneslopene.no',
 false
),
(
    'd1000000-0000-0000-0000-000000000005',
    'Astrid Lien',
    ARRAY['Sosiale medier', 'Fotografering'],
    'AL',
    NULL,
    'astrid@kalneslopene.no',
 false
);

