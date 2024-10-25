CREATE TABLE IF NOT EXISTS public.bookings
(
    during tsrange,
    id bigserial,
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT events_during_excl EXCLUDE USING gist (
        during WITH &&)

);
