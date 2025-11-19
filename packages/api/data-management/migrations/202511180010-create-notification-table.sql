-- up Migration
CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  author VARCHAR(255) NOT NULL,
  from_user VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  is_read VARCHAR(30) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Down Migration
DROP TABLE IF EXISTS user_profile_interactions;