create view global_shares with lessons as (select song_leader_joins.*,
                        concat(minutes_id, ',', lesson_id) as minute_lesson_id
                 from song_leader_joins
                 group by minute_lesson_id)
   , lesson_total as (select count(distinct minute_lesson_id) as lesson_total
                      from lessons)
   , lesson_counts as (select song_id
                            , count(distinct minute_lesson_id) as lesson_count
                       from lessons
                       group by song_id)
select song_id,
       lesson_count,
       lesson_count * 1.0 / lesson_total as song_share
from lesson_counts
         join lesson_total
order by lesson_count desc;





with particular_share as (with lessons as (select song_leader_joins.*,
                                                  concat(song_leader_joins.minutes_id, ',', lesson_id) as minute_lesson_id
                                           from song_leader_joins
                                                    join minutes
                                                         on minutes.id = song_leader_joins.minutes_id
                                                    join minutes_location_joins
                                                         on minutes_location_joins.minutes_id = minutes.id
                                                    join locations
                                                         on locations.id = minutes_location_joins.location_id
                                           where locations.state_province = 'IL' -- change state here
                                           group by minute_lesson_id)
                             , lesson_total as (select count(distinct minute_lesson_id) as lesson_total
                                                from lessons)
                             , lesson_counts as (select song_id
                                                      , count(distinct minute_lesson_id) as lesson_count
                                                 from lessons
                                                 group by song_id)
                          select songs.id                          as song_id
                               , book_song_joins.page_num
                               , songs.title
                               , lesson_count
                               , lesson_count * 1.0 / lesson_total as song_share
                          from lesson_counts
                                   join songs
                                        on songs.id = lesson_counts.song_id
                                   join book_song_joins
                                        on songs.id = book_song_joins.song_id
                                   join lesson_total
                          where book_song_joins.book_id = 2
                          order by song_share desc)

select particular_share.*
     , particular_share.song_share - global_shares.song_share as delta_arith
     , particular_share.song_share / global_shares.song_share as delta_geo
     , pow(particular_share.song_share / global_shares.song_share - 1, 2) as delta_geo_sq
     , global_shares.song_share                               as global_song_share

from particular_share
         join global_shares
              on particular_share.song_id = global_shares.song_id
where particular_share.lesson_count >= 10
order by delta_arith desc
-- limit 10