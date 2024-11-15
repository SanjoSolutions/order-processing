ALTER TABLE public.services
DROP CONSTRAINT services_check,
ADD CHECK (
  company_id IS NOT NULL
  AND permanent_establishment_id IS NULL
  OR company_id IS NULL
  AND permanent_establishment_id IS NOT NULL
);
