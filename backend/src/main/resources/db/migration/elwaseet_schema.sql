-- =====================================================
-- elwaseet Database Schema
-- PostgreSQL 15+
-- Created: December 3, 2025
-- =====================================================

-- Create database (run separately if needed)
-- CREATE DATABASE elwaseet_db;
-- \c elwaseet_db;

-- =====================================================
-- DROP EXISTING OBJECTS (for clean recreation)
-- =====================================================

DROP TABLE IF EXISTS email_queue CASCADE;
DROP TABLE IF EXISTS review_reports CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS dispute_appeals CASCADE;
DROP TABLE IF EXISTS dispute_evidence_photos CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS application_photos CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS job_photos CASCADE;
DROP TABLE IF EXISTS job_categories CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS service_photos CASCADE;
DROP TABLE IF EXISTS provider_service_categories CASCADE;
DROP TABLE IF EXISTS provider_services CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP TABLE IF EXISTS portfolio_photos CASCADE;
DROP TABLE IF EXISTS provider_profiles CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS account_type CASCADE;
DROP TYPE IF EXISTS urgency_level CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS dispute_reason CASCADE;
DROP TYPE IF EXISTS dispute_status CASCADE;
DROP TYPE IF EXISTS dispute_resolution CASCADE;
DROP TYPE IF EXISTS appeal_status CASCADE;
DROP TYPE IF EXISTS report_status CASCADE;
DROP TYPE IF EXISTS email_status CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;

-- =====================================================
-- CREATE ENUMS
-- =====================================================

CREATE TYPE account_type AS ENUM ('CUSTOMER', 'HYBRID_PROVIDER');

CREATE TYPE verification_status AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE urgency_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TYPE job_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TYPE application_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

CREATE TYPE transaction_status AS ENUM (
    'COMMITTED', 
    'IN_PROGRESS', 
    'COMPLETED', 
    'CONFIRMED', 
    'DISPUTED', 
    'RESOLVED'
);

CREATE TYPE dispute_reason AS ENUM (
    'WORK_INCOMPLETE',
    'WORK_POOR_QUALITY',
    'PROVIDER_NO_SHOW',
    'PROVIDER_LATE',
    'CUSTOMER_CHANGED_REQUIREMENTS',
    'PAYMENT_DISPUTE',
    'DAMAGED_PROPERTY',
    'SAFETY_ISSUE',
    'OTHER'
);

CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'APPEALED');

CREATE TYPE dispute_resolution AS ENUM (
    'PROVIDER_FULL', 
    'CUSTOMER_FULL', 
    'SPLIT', 
    'FIX_REQUIRED'
);

CREATE TYPE appeal_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'FINAL_DECISION');

CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED');

CREATE TYPE email_status AS ENUM ('PENDING', 'SENT', 'FAILED');

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- -----------------------------------------------------
-- Table: USERS
-- -----------------------------------------------------
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    account_type account_type NOT NULL,
    profile_photo_url VARCHAR(500),
    simulated_balance DECIMAL(10,2) DEFAULT 0.00,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX idx_users_location ON users(location);

-- -----------------------------------------------------
-- Table: OTP_CODES
-- -----------------------------------------------------
CREATE TABLE otp_codes (
    otp_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_otp_user_id ON otp_codes(user_id);
CREATE INDEX idx_otp_expires_at ON otp_codes(expires_at);

-- -----------------------------------------------------
-- Table: ADMIN_USERS
-- -----------------------------------------------------
CREATE TABLE admin_users (
    admin_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Indexes
CREATE INDEX idx_admin_email ON admin_users(email);

-- -----------------------------------------------------
-- Table: PROVIDER_PROFILES
-- -----------------------------------------------------
CREATE TABLE provider_profiles (
    profile_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    service_areas TEXT,
    availability_description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_requested_at TIMESTAMP,
    verification_status verification_status DEFAULT 'NONE',
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_jobs_completed INT DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_provider_user_id ON provider_profiles(user_id);
CREATE INDEX idx_provider_verified ON provider_profiles(is_verified);
CREATE INDEX idx_provider_rating ON provider_profiles(average_rating DESC);

-- -----------------------------------------------------
-- Table: PORTFOLIO_PHOTOS
-- -----------------------------------------------------
CREATE TABLE portfolio_photos (
    photo_id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES provider_profiles(profile_id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    upload_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_photo_profile_id ON portfolio_photos(profile_id);
CREATE INDEX idx_portfolio_photo_order ON portfolio_photos(profile_id, upload_order);

-- -----------------------------------------------------
-- Table: SERVICE_CATEGORIES
-- -----------------------------------------------------
CREATE TABLE service_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_category_name ON service_categories(category_name);
CREATE INDEX idx_category_active ON service_categories(is_active);

-- -----------------------------------------------------
-- Table: PROVIDER_SERVICES
-- -----------------------------------------------------
CREATE TABLE provider_services (
    service_id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES provider_profiles(profile_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_service_profile_id ON provider_services(profile_id);
CREATE INDEX idx_service_price ON provider_services(price);

-- -----------------------------------------------------
-- Table: PROVIDER_SERVICE_CATEGORIES (Junction Table)
-- Many-to-Many: provider_services <-> service_categories
-- -----------------------------------------------------
CREATE TABLE provider_service_categories (
    service_id BIGINT NOT NULL REFERENCES provider_services(service_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES service_categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, category_id)
);

-- Indexes
CREATE INDEX idx_psc_service_id ON provider_service_categories(service_id);
CREATE INDEX idx_psc_category_id ON provider_service_categories(category_id);

-- -----------------------------------------------------
-- Table: SERVICE_PHOTOS
-- -----------------------------------------------------
CREATE TABLE service_photos (
    photo_id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES provider_services(service_id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    upload_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_service_photo_service_id ON service_photos(service_id);
CREATE INDEX idx_service_photo_order ON service_photos(service_id, upload_order);

-- -----------------------------------------------------
-- Table: JOBS
-- -----------------------------------------------------
CREATE TABLE jobs (
    job_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget_min DECIMAL(10,2) NOT NULL,
    budget_max DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    urgency urgency_level NOT NULL,
    status job_status DEFAULT 'OPEN',
    accepted_application_id BIGINT, -- FK added later after applications table
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    CONSTRAINT check_budget CHECK (budget_max >= budget_min)
);

-- Indexes
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_urgency ON jobs(urgency);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);

-- -----------------------------------------------------
-- Table: JOB_CATEGORIES (Junction Table)
-- Many-to-Many: jobs <-> service_categories
-- -----------------------------------------------------
CREATE TABLE job_categories (
    job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES service_categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, category_id)
);

-- Indexes
CREATE INDEX idx_jc_job_id ON job_categories(job_id);
CREATE INDEX idx_jc_category_id ON job_categories(category_id);

-- -----------------------------------------------------
-- Table: JOB_PHOTOS
-- -----------------------------------------------------
CREATE TABLE job_photos (
    photo_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    upload_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_job_photo_job_id ON job_photos(job_id);
CREATE INDEX idx_job_photo_order ON job_photos(job_id, upload_order);

-- -----------------------------------------------------
-- Table: APPLICATIONS
-- -----------------------------------------------------
CREATE TABLE applications (
    application_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    provider_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    quoted_price DECIMAL(10,2) NOT NULL,
    availability TEXT,
    message TEXT,
    status application_status DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_application_per_provider_per_job UNIQUE (provider_id, job_id)
);

-- Indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_provider_id ON applications(provider_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- Add FK from jobs to applications (circular reference)
ALTER TABLE jobs 
ADD CONSTRAINT fk_jobs_accepted_application 
FOREIGN KEY (accepted_application_id) 
REFERENCES applications(application_id) ON DELETE SET NULL;

CREATE INDEX idx_jobs_accepted_application ON jobs(accepted_application_id);

-- -----------------------------------------------------
-- Table: APPLICATION_PHOTOS
-- -----------------------------------------------------
CREATE TABLE application_photos (
    photo_id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    upload_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_app_photo_application_id ON application_photos(application_id);
CREATE INDEX idx_app_photo_order ON application_photos(application_id, upload_order);

-- -----------------------------------------------------
-- Table: TRANSACTIONS
-- -----------------------------------------------------
CREATE TABLE transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL UNIQUE REFERENCES jobs(job_id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    provider_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'COMMITTED',
    committed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    in_progress_at TIMESTAMP,
    completed_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    disputed_at TIMESTAMP,
    resolved_at TIMESTAMP,
    customer_balance_before DECIMAL(10,2),
    customer_balance_after DECIMAL(10,2),
    provider_balance_before DECIMAL(10,2),
    provider_balance_after DECIMAL(10,2),
    auto_confirm_scheduled_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_job_id ON transactions(job_id);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_provider_id ON transactions(provider_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_auto_confirm ON transactions(auto_confirm_scheduled_at) 
    WHERE status = 'COMPLETED';

-- -----------------------------------------------------
-- Table: DISPUTES
-- -----------------------------------------------------
CREATE TABLE disputes (
    dispute_id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL UNIQUE REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    opened_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reason_category dispute_reason NOT NULL,
    description TEXT NOT NULL,
    status dispute_status DEFAULT 'OPEN',
    resolution dispute_resolution,
    resolution_notes TEXT,
    resolved_by BIGINT REFERENCES admin_users(admin_id) ON DELETE SET NULL,
    split_percentage_customer DECIMAL(5,2),
    split_percentage_provider DECIMAL(5,2),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    appeal_deadline TIMESTAMP,
    CONSTRAINT check_split_percentages 
        CHECK (
            (split_percentage_customer IS NULL AND split_percentage_provider IS NULL) OR
            (split_percentage_customer + split_percentage_provider = 100)
        )
);

-- Indexes
CREATE INDEX idx_disputes_transaction_id ON disputes(transaction_id);
CREATE INDEX idx_disputes_job_id ON disputes(job_id);
CREATE INDEX idx_disputes_opened_by ON disputes(opened_by);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_resolved_by ON disputes(resolved_by);
CREATE INDEX idx_disputes_reason ON disputes(reason_category);

-- -----------------------------------------------------
-- Table: DISPUTE_EVIDENCE_PHOTOS
-- -----------------------------------------------------
CREATE TABLE dispute_evidence_photos (
    photo_id BIGSERIAL PRIMARY KEY,
    dispute_id BIGINT NOT NULL REFERENCES disputes(dispute_id) ON DELETE CASCADE,
    uploaded_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_dispute_photo_dispute_id ON dispute_evidence_photos(dispute_id);
CREATE INDEX idx_dispute_photo_uploaded_by ON dispute_evidence_photos(uploaded_by);

-- -----------------------------------------------------
-- Table: DISPUTE_APPEALS
-- -----------------------------------------------------
CREATE TABLE dispute_appeals (
    appeal_id BIGSERIAL PRIMARY KEY,
    dispute_id BIGINT NOT NULL UNIQUE REFERENCES disputes(dispute_id) ON DELETE CASCADE,
    appealed_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    appeal_reason TEXT NOT NULL,
    appeal_status appeal_status DEFAULT 'PENDING',
    final_resolution VARCHAR(50),
    final_notes TEXT,
    reviewed_by BIGINT REFERENCES admin_users(admin_id) ON DELETE SET NULL,
    appealed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_appeals_dispute_id ON dispute_appeals(dispute_id);
CREATE INDEX idx_appeals_appealed_by ON dispute_appeals(appealed_by);
CREATE INDEX idx_appeals_reviewed_by ON dispute_appeals(reviewed_by);
CREATE INDEX idx_appeals_status ON dispute_appeals(appeal_status);

-- -----------------------------------------------------
-- Table: REVIEWS
-- -----------------------------------------------------
CREATE TABLE reviews (
    review_id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reviewee_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_edited BOOLEAN DEFAULT FALSE,
    review_deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edit_deadline TIMESTAMP,
    CONSTRAINT unique_review_per_transaction_per_reviewer 
        UNIQUE (transaction_id, reviewer_id),
    CONSTRAINT check_comment_length CHECK (LENGTH(comment) <= 500)
);

-- Indexes
CREATE INDEX idx_reviews_transaction_id ON reviews(transaction_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- -----------------------------------------------------
-- Table: REVIEW_REPORTS
-- -----------------------------------------------------
CREATE TABLE review_reports (
    report_id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    reported_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'PENDING',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by BIGINT REFERENCES admin_users(admin_id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX idx_review_reports_reported_by ON review_reports(reported_by);
CREATE INDEX idx_review_reports_status ON review_reports(status);
CREATE INDEX idx_review_reports_reviewed_by ON review_reports(reviewed_by);

-- -----------------------------------------------------
-- Table: EMAIL_QUEUE
-- -----------------------------------------------------
CREATE TABLE email_queue (
    email_id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    status email_status DEFAULT 'PENDING',
    attempts INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_recipient_user ON email_queue(recipient_user_id);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at
    BEFORE UPDATE ON provider_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON DATABASE elwaseet_db IS 'Local services marketplace with escrow payment system';

COMMENT ON TABLE users IS 'Core user accounts (customers and hybrid providers)';
COMMENT ON TABLE provider_profiles IS 'Extended profile for service providers';
COMMENT ON TABLE service_categories IS 'Fixed reference table of service categories';
COMMENT ON TABLE provider_services IS 'Services offered by providers';
COMMENT ON TABLE provider_service_categories IS 'Junction table: provider_services <-> service_categories';
COMMENT ON TABLE jobs IS 'Customer job requests';
COMMENT ON TABLE job_categories IS 'Junction table: jobs <-> service_categories';
COMMENT ON TABLE applications IS 'Provider applications to jobs';
COMMENT ON TABLE transactions IS 'Escrow transaction ledger';
COMMENT ON TABLE disputes IS 'Dispute cases for unresolved transactions';
COMMENT ON TABLE reviews IS 'Star ratings and feedback';
COMMENT ON TABLE email_queue IS 'Outbound email queue for SendGrid';

COMMENT ON COLUMN transactions.auto_confirm_scheduled_at IS 'When to auto-confirm if customer does not respond (48 hours after completed_at)';
COMMENT ON COLUMN disputes.split_percentage_customer IS 'If resolution is SPLIT, percentage customer receives';
COMMENT ON COLUMN disputes.split_percentage_provider IS 'If resolution is SPLIT, percentage provider receives';
COMMENT ON COLUMN reviews.review_deadline IS 'Deadline to submit review (typically 7 days after transaction confirmed)';
COMMENT ON COLUMN reviews.edit_deadline IS 'Deadline to edit review (typically 24 hours after creation)';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- List all foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- List all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert test data

/*
-- Insert sample service categories
INSERT INTO service_categories (category_name, parent_category, description) VALUES
('Home Services', NULL, 'General home repair and maintenance'),
('Plumbing', 'Home Services', 'Plumbing repairs and installations'),
('Electrical', 'Home Services', 'Electrical work and repairs'),
('Cleaning', NULL, 'Cleaning services'),
('Home Cleaning', 'Cleaning', 'Residential cleaning'),
('Tutoring', NULL, 'Educational tutoring services'),
('Tech Repair', NULL, 'Technology repair services');

-- Insert sample admin user
INSERT INTO admin_users (email, password_hash, name) VALUES
('admin@elwaseet.com', '$2a$10$EXAMPLE_HASH', 'System Admin');

-- Insert sample users
INSERT INTO users (email, password_hash, name, phone, location, account_type, is_email_verified) VALUES
('john@example.com', '$2a$10$EXAMPLE_HASH', 'John Doe', '+96170123456', 'Beirut', 'CUSTOMER', TRUE),
('mike@example.com', '$2a$10$EXAMPLE_HASH', 'Mike Fix', '+96170987654', 'Beirut', 'HYBRID_PROVIDER', TRUE);
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
