-- up Migration
ALTER TABLE users
ADD COLUMN is_first_login VARCHAR(3) DEFAULT 'yes';


-- Down Migration
ALTER TABLE users
DROP COLUMN IF EXISTS is_first_login;