-- Up Migration
ALTER TABLE users
  ADD COLUMN gender VARCHAR(64),
  ADD COLUMN sexual_orientation VARCHAR(100),
  ADD COLUMN bio VARCHAR(255);

-- Down Migration
ALTER TABLE users
  DROP COLUMN IF EXISTS gender,
  DROP COLUMN IF EXISTS sexual_orientation,
  DROP COLUMN IF EXISTS bio;
