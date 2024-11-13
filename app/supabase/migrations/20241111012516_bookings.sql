CREATE TABLE IF NOT EXISTS
  public.bookings (
    during tsrange,
    id bigserial,
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT bookings_during_excl EXCLUDE USING gist (
      during
      WITH
        &&
    )
  );

ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to retrieve all bookings" ON "public"."bookings" AS PERMISSIVE FOR
SELECT
  TO public USING (TRUE);

CREATE POLICY "Anyone can create a booking" ON "public"."bookings" AS PERMISSIVE FOR INSERT TO public
WITH
  CHECK (TRUE);
