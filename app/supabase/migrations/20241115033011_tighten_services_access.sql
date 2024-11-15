DROP POLICY "Enable insert for authenticated users only" ON "public"."services";

CREATE POLICY "Admins can add services" ON "public"."services" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (
    company_id IN (
      SELECT
        companies_that_user_is_admin_of ()
    )
    OR permanent_establishment_id IN (
      SELECT
        permanent_establishments_of_companies_that_user_is_admin_of ()
    )
  );
