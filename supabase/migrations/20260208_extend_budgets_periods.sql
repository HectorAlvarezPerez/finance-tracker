-- Extend budgets to support monthly and annual category budgets.
-- This migration is written to be safe on existing installs with the legacy monthly schema.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'month'
      AND data_type = 'date'
  ) THEN
    ALTER TABLE public.budgets RENAME COLUMN month TO month_date_legacy;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'amount_total'
  ) THEN
    ALTER TABLE public.budgets RENAME COLUMN amount_total TO amount_legacy;
  END IF;
END $$;

ALTER TABLE public.budgets
  ADD COLUMN IF NOT EXISTS period_type TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS month INTEGER,
  ADD COLUMN IF NOT EXISTS amount DECIMAL(15, 2);

UPDATE public.budgets
SET period_type = COALESCE(period_type, 'monthly');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'month_date_legacy'
  ) THEN
    UPDATE public.budgets
    SET year = COALESCE(year, EXTRACT(YEAR FROM month_date_legacy)::INTEGER),
        month = COALESCE(month, EXTRACT(MONTH FROM month_date_legacy)::INTEGER)
    WHERE year IS NULL OR month IS NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'amount_legacy'
  ) THEN
    UPDATE public.budgets
    SET amount = COALESCE(amount, amount_legacy)
    WHERE amount IS NULL;
  END IF;
END $$;

ALTER TABLE public.budgets
  ALTER COLUMN period_type SET DEFAULT 'monthly',
  ALTER COLUMN currency SET DEFAULT 'EUR';

UPDATE public.budgets
SET currency = 'EUR'
WHERE currency IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'budgets_period_type_allowed_check'
      AND conrelid = 'public.budgets'::regclass
  ) THEN
    ALTER TABLE public.budgets
      ADD CONSTRAINT budgets_period_type_allowed_check
      CHECK (period_type IN ('monthly', 'annual'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'budgets_month_required_by_period_check'
      AND conrelid = 'public.budgets'::regclass
  ) THEN
    ALTER TABLE public.budgets
      ADD CONSTRAINT budgets_month_required_by_period_check
      CHECK (
        (period_type = 'monthly' AND month IS NOT NULL AND month BETWEEN 1 AND 12)
        OR (period_type = 'annual' AND month IS NULL)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.budgets
    WHERE category_id IS NULL
  ) THEN
    ALTER TABLE public.budgets ALTER COLUMN category_id SET NOT NULL;
  END IF;
END $$;

ALTER TABLE public.budgets
  ALTER COLUMN period_type SET NOT NULL,
  ALTER COLUMN year SET NOT NULL,
  ALTER COLUMN amount SET NOT NULL;

DO $$
DECLARE
  duplicate_constraint_name TEXT;
BEGIN
  SELECT conname
  INTO duplicate_constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.budgets'::regclass
    AND contype = 'u'
    AND conname = 'budgets_user_id_category_id_month_key';

  IF duplicate_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.budgets DROP CONSTRAINT %I', duplicate_constraint_name);
  END IF;
END $$;

DROP INDEX IF EXISTS public.idx_budgets_month;

CREATE INDEX IF NOT EXISTS idx_budgets_period ON public.budgets(period_type, year, month);

CREATE UNIQUE INDEX IF NOT EXISTS idx_budgets_unique_period_category
  ON public.budgets(user_id, period_type, year, COALESCE(month, 0), category_id);

ALTER TABLE public.budgets DROP COLUMN IF EXISTS month_date_legacy;
ALTER TABLE public.budgets DROP COLUMN IF EXISTS amount_legacy;
