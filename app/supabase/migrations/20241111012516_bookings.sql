CREATE TABLE IF NOT EXISTS public.bookings
(
    during tsrange,
    id bigserial,
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT bookings_during_excl EXCLUDE USING gist (
        during WITH &&)

);

create policy "Allow anyone to retrieve all bookings"
on "public"."bookings"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Anyone can create a booking"
on "public"."bookings"
as PERMISSIVE
for INSERT
to public
with check (
  true
);
