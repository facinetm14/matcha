-- Up Migration
CREATE TABLE user_interests (
  id VARCHAR(255) PRIMARY KEY,  
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  interest_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Down Migration
DROP TABLE IF EXISTS user_interests;