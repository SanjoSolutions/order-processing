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

ALTER TABLE public.services
ADD COLUMN company_id int8,
ADD COLUMN permanent_establishment_id int8,
ADD FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
ADD FOREIGN KEY (permanent_establishment_id) REFERENCES permanent_establishments (id) ON DELETE CASCADE,
ADD CHECK (
  company_id IS NOT NULL
  OR permanent_establishment_id IS NOT NULL
);

ALTER PUBLICATION supabase_realtime
ADD TABLE public.services;
