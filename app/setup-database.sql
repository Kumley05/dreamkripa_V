-- Dreamkripa Database Setup
-- Run this SQL on your external MySQL database (Aiven, PlanetScale, Railway, etc.)

CREATE DATABASE IF NOT EXISTS higher_ed_leads;
USE higher_ed_leads;

-- Program Categories
CREATE TABLE IF NOT EXISTS program_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (slug),
    INDEX (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    level VARCHAR(100),
    duration VARCHAR(100),
    eligibility_criteria TEXT,
    fee_range VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES program_categories(id) ON DELETE SET NULL,
    INDEX (slug),
    INDEX (category_id),
    INDEX (level),
    INDEX (is_active),
    INDEX (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    program_of_interest_id INT,
    program_category_id INT,
    education_level VARCHAR(100),
    current_city VARCHAR(100),
    state VARCHAR(100),
    preferred_intake VARCHAR(100),
    message TEXT,
    source VARCHAR(100) DEFAULT 'website',
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost', 'duplicate') DEFAULT 'new',
    assigned_to_id INT,
    assigned_at DATETIME DEFAULT NULL,
    notes TEXT,
    consent_email BOOLEAN DEFAULT TRUE,
    consent_phone BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_of_interest_id) REFERENCES programs(id) ON DELETE SET NULL,
    FOREIGN KEY (program_category_id) REFERENCES program_categories(id) ON DELETE SET NULL,
    INDEX (email),
    INDEX (status),
    INDEX (created_at),
    INDEX (program_of_interest_id),
    INDEX (program_category_id),
    INDEX (education_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lead Activities
CREATE TABLE IF NOT EXISTS lead_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    performed_by VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    INDEX (lead_id),
    INDEX (activity_type),
    INDEX (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users (admin + telecallers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'telecaller') NOT NULL DEFAULT 'telecaller',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (email),
    INDEX (role),
    INDEX (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lead Follow-ups
CREATE TABLE IF NOT EXISTS lead_followups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost', 'duplicate', 'callback') NOT NULL DEFAULT 'contacted',
    remarks TEXT,
    next_followup_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (lead_id),
    INDEX (user_id),
    INDEX (next_followup_at),
    INDEX (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: Admin user (email: admin@example.com, password: admin123)
INSERT INTO users (name, email, password, role, phone, is_active) VALUES
('Admin', 'admin@example.com', '$2b$10$XNG5y8ebgahAftTYxvI/teIeUS0GUdHpexbc8IlNkjKAiDR1MIeDa', 'admin', '+919876543210', TRUE);

-- Seed: Program Categories
INSERT INTO program_categories (name, slug, description, icon, display_order) VALUES
('Engineering & Technology', 'engineering', 'Build your future with cutting-edge engineering programs', '🔧', 1),
('Business & Management', 'business', 'Develop leadership and entrepreneurial skills', '💼', 2),
('Medical & Health Sciences', 'medical', 'Pursue a rewarding career in healthcare', '🏥', 3),
('Arts & Humanities', 'arts', 'Explore creative and cultural studies', '🎨', 4),
('Science & Research', 'science', 'Drive innovation through scientific discovery', '🔬', 5),
('Law & Legal Studies', 'law', 'Shape justice and legal systems', '⚖️', 6),
('Computer Applications', 'computer-apps', 'Master the digital world', '💻', 7),
('Education & Teaching', 'education', 'Inspire the next generation', '📚', 8),
('Commerce', 'commerce', 'Build a strong foundation in accounting, finance and business', '📊', 9);

-- Seed: Programs
INSERT INTO programs (category_id, title, slug, description, level, duration, eligibility_criteria, fee_range, featured, display_order) VALUES
(1, 'B.Tech in Computer Science', 'btech-cse', 'Software development, programming, AI and data structures', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹4-8 Lakhs', TRUE, 1),
(1, 'B.Tech in Mechanical', 'btech-mechanical', 'Machines, manufacturing, thermodynamics and automation', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹3-6 Lakhs', TRUE, 2),
(1, 'B.Tech in Civil', 'btech-civil', 'Structural engineering, construction and infrastructure development', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹3-6 Lakhs', TRUE, 3),
(1, 'B.Tech in Electrical', 'btech-electrical', 'Electrical systems, power generation and circuit design', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹3-6 Lakhs', FALSE, 4),
(1, 'B.Tech in Electronics', 'btech-electronics', 'Electronic devices, communication systems and signal processing', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹3-6 Lakhs', FALSE, 5),
(1, 'B.Tech in AI & Data Science', 'btech-ai-ds', 'Artificial intelligence, machine learning and big data analytics', 'Undergraduate', '4 Years', '12th with PCM, 60%+', '₹4-8 Lakhs', TRUE, 6),
(1, 'M.Tech in Structural Engineering', 'mtech-structural', 'Advanced structural analysis, design and construction management', 'Postgraduate', '2 Years', 'B.Tech/B.E. in Civil', '₹2-5 Lakhs', FALSE, 7),
(1, 'M.Tech in VLSI Design', 'mtech-vlsi', 'VLSI circuit design and semiconductor technology', 'Postgraduate', '2 Years', 'B.Tech/B.E. in ECE/EEE', '₹2-5 Lakhs', FALSE, 8),
(1, 'M.Tech in Software Engineering', 'mtech-software', 'Advanced software development methodologies and architectures', 'Postgraduate', '2 Years', 'B.Tech/B.E. in CS/IT', '₹2-5 Lakhs', TRUE, 9),
(1, 'M.Tech in Robotics', 'mtech-robotics', 'Robotics, automation and intelligent control systems', 'Postgraduate', '2 Years', 'B.Tech/B.E. in ME/ECE/CS', '₹2-5 Lakhs', FALSE, 10),
(2, 'BBA in Marketing', 'bba-marketing', 'Marketing strategies, brand management and consumer behavior', 'Undergraduate', '3 Years', '12th any stream, 50%+', '₹2-5 Lakhs', TRUE, 1),
(2, 'BBA in Finance', 'bba-finance', 'Financial management, investment analysis and banking', 'Undergraduate', '3 Years', '12th any stream, 50%+', '₹2-5 Lakhs', TRUE, 2),
(2, 'BBA in Human Resource Management', 'bba-hrm', 'People management, organizational behavior and HR strategy', 'Undergraduate', '3 Years', '12th any stream, 50%+', '₹2-5 Lakhs', FALSE, 3),
(2, 'BBA in International Business', 'bba-international', 'Global trade, cross-cultural management and international markets', 'Undergraduate', '3 Years', '12th any stream, 50%+', '₹2-5 Lakhs', FALSE, 4),
(2, 'MBA in Marketing', 'mba-marketing', 'Advanced marketing strategy, digital marketing and brand leadership', 'Postgraduate', '2 Years', 'Graduate with 50%+', '₹5-20 Lakhs', TRUE, 5),
(2, 'MBA in Finance', 'mba-finance', 'Corporate finance, investment banking and financial analysis', 'Postgraduate', '2 Years', 'Graduate with 50%+', '₹5-20 Lakhs', TRUE, 6),
(2, 'MBA in HR', 'mba-hr', 'Strategic HR management, talent acquisition and organizational development', 'Postgraduate', '2 Years', 'Graduate with 50%+', '₹5-20 Lakhs', FALSE, 7),
(2, 'MBA in Operations', 'mba-operations', 'Supply chain management, logistics and operational excellence', 'Postgraduate', '2 Years', 'Graduate with 50%+', '₹5-20 Lakhs', FALSE, 8),
(2, 'MBA in Business Analytics', 'mba-analytics', 'Data-driven decision making, predictive modeling and business intelligence', 'Postgraduate', '2 Years', 'Graduate with 50%+', '₹5-20 Lakhs', TRUE, 9),
(3, 'MBBS - General Medicine', 'mbbs', 'Comprehensive medical education covering all body systems and clinical practice', 'Undergraduate', '5.5 Years', '12th with PCB, NEET qualified', '₹10-50 Lakhs', TRUE, 1),
(3, 'B.Sc in Nursing', 'bsc-nursing', 'Patient care, medical-surgical nursing and community health', 'Undergraduate', '4 Years', '12th with PCB, 45%+', '₹2-5 Lakhs', FALSE, 2),
(3, 'B.Pharma', 'bpharma', 'Pharmaceutical sciences, drug formulation and pharmacology', 'Undergraduate', '4 Years', '12th with PCB/PCM, 50%+', '₹2-4 Lakhs', FALSE, 3),
(3, 'BPT (Physiotherapy)', 'bpt', 'Physical rehabilitation, movement science and sports therapy', 'Undergraduate', '4.5 Years', '12th with PCB, 50%+', '₹2-5 Lakhs', FALSE, 4),
(3, 'BDS (Dental Surgery)', 'bds', 'Dental sciences, oral health and maxillofacial surgery', 'Undergraduate', '5 Years', '12th with PCB, NEET qualified', '₹5-30 Lakhs', TRUE, 5),
(4, 'BA in English', 'ba-english', 'English literature, language studies and creative writing', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-3 Lakhs', TRUE, 1),
(4, 'BA in History', 'ba-history', 'World history, Indian heritage and historiography', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-3 Lakhs', FALSE, 2),
(4, 'BA in Political Science', 'ba-political-science', 'Political theory, governance, international relations and public policy', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-3 Lakhs', FALSE, 3),
(4, 'BA in Psychology', 'ba-psychology', 'Human behavior, mental processes and counseling fundamentals', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-3 Lakhs', TRUE, 4),
(4, 'BA in Sociology', 'ba-sociology', 'Social structures, cultural dynamics and community studies', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-3 Lakhs', FALSE, 5),
(5, 'B.Sc in Physics', 'bsc-physics', 'Classical and modern physics, quantum mechanics and astrophysics', 'Undergraduate', '3 Years', '12th with Science, 50%+', '₹1-3 Lakhs', FALSE, 1),
(5, 'B.Sc in Chemistry', 'bsc-chemistry', 'Organic, inorganic and physical chemistry with lab work', 'Undergraduate', '3 Years', '12th with Science, 50%+', '₹1-3 Lakhs', FALSE, 2),
(5, 'B.Sc in Mathematics', 'bsc-mathematics', 'Pure and applied mathematics, statistics and numerical analysis', 'Undergraduate', '3 Years', '12th with Math, 50%+', '₹1-3 Lakhs', FALSE, 3),
(5, 'B.Sc in Biotechnology', 'bsc-biotech', 'Genetic engineering, molecular biology and bioinformatics', 'Undergraduate', '3 Years', '12th with Science, 50%+', '₹1-3 Lakhs', TRUE, 4),
(5, 'B.Sc in Computer Science', 'bsc-cs', 'Programming, algorithms, database management and software fundamentals', 'Undergraduate', '3 Years', '12th with Math, 50%+', '₹1-4 Lakhs', TRUE, 5),
(6, 'BA LL.B (Integrated)', 'ba-llb', '5-year integrated law degree combining arts and legal studies', 'Integrated', '5 Years', '12th any stream, 45%+', '₹3-8 Lakhs', TRUE, 1),
(6, 'LL.B (Bachelor of Law)', 'llb', '3-year law degree for graduates', 'Undergraduate', '3 Years', 'Any Graduate, 45%+', '₹2-5 Lakhs', FALSE, 2),
(6, 'LL.M (Master of Law)', 'llm', 'Advanced legal specialization in constitutional, corporate or criminal law', 'Postgraduate', '2 Years', 'LL.B with 50%+', '₹2-6 Lakhs', FALSE, 3),
(7, 'BCA (Bachelor of Computer Applications)', 'bca', 'Software development, database management and programming fundamentals', 'Undergraduate', '3 Years', '12th any stream, 45%+', '₹1-4 Lakhs', TRUE, 1),
(7, 'MCA (Master of Computer Applications)', 'mca', 'Advanced software engineering, system design and application development', 'Postgraduate', '2 Years', 'BCA/B.Sc. CS with Math', '₹2-5 Lakhs', TRUE, 2),
(8, 'B.Ed (Bachelor of Education)', 'bed', 'Teaching certification for primary and secondary education', 'Undergraduate', '2 Years', 'Graduate with 50%+', '₹1-3 Lakhs', TRUE, 1),
(8, 'D.El.Ed (Diploma in Elementary Education)', 'deled', 'Elementary teacher training and pedagogy', 'Diploma', '2 Years', '12th any stream, 50%+', '₹0.5-2 Lakhs', FALSE, 2),
(8, 'M.Ed (Master of Education)', 'med', 'Advanced teaching methodologies, educational leadership and research', 'Postgraduate', '2 Years', 'B.Ed with 50%+', '₹1-3 Lakhs', FALSE, 3),
(9, 'B.Com in Accounting', 'bcom-accounting', 'Financial accounting, auditing and corporate accounting practices', 'Undergraduate', '3 Years', '12th Commerce/any stream, 50%+', '₹1-3 Lakhs', TRUE, 1),
(9, 'B.Com in Finance', 'bcom-finance', 'Financial markets, investment analysis and portfolio management', 'Undergraduate', '3 Years', '12th Commerce/any stream, 50%+', '₹1-3 Lakhs', TRUE, 2),
(9, 'B.Com in Banking & Insurance', 'bcom-banking-insurance', 'Banking operations, insurance principles and risk management', 'Undergraduate', '3 Years', '12th Commerce/any stream, 50%+', '₹1-3 Lakhs', FALSE, 3),
(9, 'B.Com in Taxation', 'bcom-taxation', 'Direct and indirect taxation, GST and tax planning', 'Undergraduate', '3 Years', '12th Commerce/any stream, 50%+', '₹1-3 Lakhs', FALSE, 4);