-- Dreamkripa Database Schema
-- Run this on your Aiven MySQL database to create all required tables

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'telecaller', 'counselor') DEFAULT 'telecaller',
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS program_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  level ENUM('Undergraduate', 'Postgraduate', 'Certificate', 'Diploma', 'Integrated') DEFAULT 'Undergraduate',
  duration VARCHAR(100),
  eligibility_criteria TEXT,
  fee_range VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES program_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  program_category_id INT,
  program_id INT,
  education_level VARCHAR(100),
  city VARCHAR(255),
  state VARCHAR(255),
  preferred_intake VARCHAR(100),
  message TEXT,
  source ENUM('website', 'contact_form', 'referral', 'phone', 'other') DEFAULT 'website',
  status ENUM('new', 'contacted', 'qualified', 'interested', 'not_interested', 'enrolled', 'lost') DEFAULT 'new',
  assigned_to INT,
  notes TEXT,
  consent_email BOOLEAN DEFAULT FALSE,
  consent_phone BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_category_id) REFERENCES program_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lead_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  user_id INT,
  activity_type ENUM('call', 'email', 'sms', 'meeting', 'note', 'status_change', 'assignment') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lead_followups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  user_id INT,
  followup_date DATETIME NOT NULL,
  followup_type ENUM('call', 'email', 'sms', 'meeting') DEFAULT 'call',
  notes TEXT,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  template VARCHAR(100),
  status ENUM('sent', 'failed', 'queued') DEFAULT 'queued',
  error_message TEXT,
  lead_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

-- Insert default admin user (password: admin123)
-- bcrypt hash generated for 'admin123'
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@dreamkripa.com', '$2b$10$4lOftlLBWO7nlyUDDtjOlebOx48dlIxFaY/b6KMDaxOu4pkA3yN8a', 'admin');

-- Insert program categories
INSERT IGNORE INTO program_categories (id, name, slug, description, icon, display_order) VALUES
(1, 'Engineering & Technology', 'engineering', 'Build your future with cutting-edge engineering programs', '⚙️', 1),
(2, 'Business & Management', 'business', 'Develop leadership and entrepreneurial skills', '💼', 2),
(3, 'Medical & Health Sciences', 'medical', 'Pursue a rewarding career in healthcare', '🏥', 3),
(4, 'Arts & Humanities', 'arts', 'Explore creative and cultural studies', '🎨', 4),
(5, 'Science & Research', 'science', 'Drive innovation through scientific discovery', '🔬', 5),
(6, 'Law & Legal Studies', 'law', 'Shape justice and legal systems', '⚖️', 6),
(7, 'Computer Applications', 'computer-apps', 'Master the digital world', '💻', 7),
(8, 'Education & Teaching', 'education', 'Inspire the next generation', '📚', 8),
(9, 'Commerce', 'commerce', 'Build a strong foundation in accounting, finance and business', '📊', 9),
(10, 'PGDM Courses', 'course', 'Post Graduate Diploma in Management programs', '🎓', 10);