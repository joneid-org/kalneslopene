update race_runner rr
set total_races  = total_races + 1,
    season_races = season_races + 1
from race r
where r.uuid = rr.race_uuid
  and r.race_date > '2026-07-09 23:59:59';
