ALTER TABLE holdings
ADD COLUMN IF NOT EXISTS weekly_quantity DECIMAL(20, 8) NOT NULL DEFAULT 0;

ALTER TABLE holdings
ADD COLUMN IF NOT EXISTS monthly_quantity DECIMAL(20, 8) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'holdings_weekly_quantity_nonnegative'
  ) THEN
    ALTER TABLE holdings
    ADD CONSTRAINT holdings_weekly_quantity_nonnegative
    CHECK (weekly_quantity >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'holdings_monthly_quantity_nonnegative'
  ) THEN
    ALTER TABLE holdings
    ADD CONSTRAINT holdings_monthly_quantity_nonnegative
    CHECK (monthly_quantity >= 0);
  END IF;
END $$;
