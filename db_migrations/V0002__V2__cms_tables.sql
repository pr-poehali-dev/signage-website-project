CREATE TABLE t_p29052039_signage_website_proj.site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  section_key VARCHAR(200) NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section, section_key)
);

CREATE TABLE t_p29052039_signage_website_proj.services (
  id SERIAL PRIMARY KEY,
  num VARCHAR(10) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  is_hot BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p29052039_signage_website_proj.portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p29052039_signage_website_proj.orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  order_type VARCHAR(100),
  description TEXT,
  file_url TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
