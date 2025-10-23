-- up Migration
CREATE TABLE IF NOT EXISTS user_profile_interactions (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  author VARCHAR(255) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  category VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Down Migration
DROP TABLE IF EXISTS user_profile_interactions;