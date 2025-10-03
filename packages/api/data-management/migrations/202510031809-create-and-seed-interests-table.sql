-- Up Migration
CREATE TABLE interests (
  id SERIAL PRIMARY KEY,  
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO interests (name)
VALUES
('Traveling'),
('Cooking'),
('Fitness'),
('Yoga'),
('Reading'),
('Movies'),
('Music'),
('Dancing'),
('Photography'),
('Hiking'),
('Gaming'),
('Art'),
('Sports'),
('Pets'),
('Wine Tasting'),
('Coffee'),
('Technology'),
('Fashion'),
('Volunteering'),
('Meditation');


--Down Migration
DROP TABLE IF EXISTS interests;