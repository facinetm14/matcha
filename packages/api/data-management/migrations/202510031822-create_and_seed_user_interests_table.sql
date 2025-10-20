-- Up Migration
CREATE TABLE user_interests (
  id VARCHAR(255) PRIMARY KEY,  
  user_id VARCHAR(255) DEFAULT NULL,
  interest VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT user_interest_unique UNIQUE (user_id, interest)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
INSERT INTO user_interests (id, interest)
VALUES
(uuid_generate_v4(), 'Traveling'),
(uuid_generate_v4(), 'Cooking'),
(uuid_generate_v4(),'Fitness'),
(uuid_generate_v4(),'Yoga'),
(uuid_generate_v4(),'Reading'),
(uuid_generate_v4(),'Movies'),
(uuid_generate_v4(),'Music'),
(uuid_generate_v4(),'Dancing'),
(uuid_generate_v4(),'Photography'),
(uuid_generate_v4(),'Hiking'),
(uuid_generate_v4(),'Gaming'),
(uuid_generate_v4(),'Art'),
(uuid_generate_v4(),'Sports'),
(uuid_generate_v4(),'Pets'),
(uuid_generate_v4(),'Wine Tasting'),
(uuid_generate_v4(),'Coffee'),
(uuid_generate_v4(),'Technology'),
(uuid_generate_v4(),'Fashion'),
(uuid_generate_v4(),'Volunteering'),
(uuid_generate_v4(),'Meditation');


-- Down Migration
DROP TABLE IF EXISTS user_interests;