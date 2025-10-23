-- Up Migration
ALTER TABLE users
  ADD COLUMN birth_date DATE DEFAULT NULL;

-- Down Migration
ALTER TABLE users
  DROP COLUMN IF EXISTS birth_date;
