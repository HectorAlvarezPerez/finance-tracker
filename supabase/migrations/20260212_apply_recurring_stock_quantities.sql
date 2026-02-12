ALTER TABLE holdings
ADD COLUMN IF NOT EXISTS recurring_last_applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

UPDATE holdings
SET recurring_last_applied_at = COALESCE(recurring_last_applied_at, created_at, NOW());

CREATE OR REPLACE FUNCTION apply_portfolio_recurring_quantities(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  holding_row holdings%ROWTYPE;
  base_ts TIMESTAMP WITH TIME ZONE;
  now_ts TIMESTAMP WITH TIME ZONE := NOW();
  weeks_due INTEGER;
  months_due INTEGER;
  added_quantity NUMERIC;
  latest_price NUMERIC;
  new_quantity NUMERIC;
  new_average_price NUMERIC;
  applied_count INTEGER := 0;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> target_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  FOR holding_row IN
    SELECT *
    FROM holdings
    WHERE user_id = target_user_id
      AND (weekly_quantity > 0 OR monthly_quantity > 0)
    FOR UPDATE
  LOOP
    base_ts := COALESCE(holding_row.recurring_last_applied_at, holding_row.created_at, now_ts);
    weeks_due := 0;
    months_due := 0;

    IF holding_row.weekly_quantity > 0 THEN
      weeks_due := FLOOR(EXTRACT(EPOCH FROM (now_ts - base_ts)) / 604800);
    END IF;

    IF holding_row.monthly_quantity > 0 THEN
      months_due := (EXTRACT(YEAR FROM AGE(now_ts, base_ts))::INT * 12)
        + EXTRACT(MONTH FROM AGE(now_ts, base_ts))::INT;
    END IF;

    added_quantity := GREATEST(0, weeks_due) * holding_row.weekly_quantity
      + GREATEST(0, months_due) * holding_row.monthly_quantity;

    IF added_quantity <= 0 THEN
      CONTINUE;
    END IF;

    SELECT price
    INTO latest_price
    FROM prices
    WHERE user_id = target_user_id
      AND asset_symbol = ('manual_' || holding_row.id::TEXT)
    ORDER BY as_of DESC
    LIMIT 1;

    latest_price := COALESCE(latest_price, holding_row.average_buy_price);
    new_quantity := holding_row.quantity + added_quantity;

    IF new_quantity <= 0 THEN
      CONTINUE;
    END IF;

    new_average_price := (
      (holding_row.quantity * holding_row.average_buy_price)
      + (added_quantity * latest_price)
    ) / new_quantity;

    UPDATE holdings
    SET
      quantity = new_quantity,
      average_buy_price = new_average_price,
      recurring_last_applied_at = now_ts
    WHERE id = holding_row.id;

    applied_count := applied_count + 1;
  END LOOP;

  RETURN applied_count;
END;
$$ LANGUAGE plpgsql;
