ALTER TABLE public.bookings
ALTER COLUMN during
SET NOT NULL;

ALTER TABLE public.permanent_establishments
RENAME COLUMN street_and_housenumber TO street_and_house_number;

ALTER TABLE public.permanent_establishments
RENAME COLUMN postalcode TO zip;

CREATE POLICY "Admin can update permanent establishments" ON "public"."permanent_establishments" AS PERMISSIVE FOR
UPDATE TO authenticated USING (
  company_id IN (
    SELECT
      companies_that_user_is_admin_of ()
  )
)
WITH
  CHECK (
    company_id IN (
      SELECT
        companies_that_user_is_admin_of ()
    )
  );
