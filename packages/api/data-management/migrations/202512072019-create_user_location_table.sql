-- up Migration
CREATE TABLE IF NOT EXISTS users_location (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  city VARCHAR(255) DEFAULT NULL,
  shared_by_user_at VARCHAR(255) DEFAULT NULL,
  lat VARCHAR(150),
  lng VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


--Down Migration
DROP TABLE IF EXISTS users_location;