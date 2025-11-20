-- up Migration
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  channel_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  is_read VARCHAR(30) DEFAULT NULL,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Down Migration
DROP TABLE IF EXISTS user_profile_interactions;