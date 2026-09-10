-- Coal Mine Smart Governance & Compliance Monitoring System
-- Supabase PostgreSQL Database DDL Schema & Initial Data Seed

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MINE SUBSIDIARIES & CORPORATIONS
CREATE TABLE IF NOT EXISTS subsidiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    headquarters VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MINES TABLE
CREATE TABLE IF NOT EXISTS mines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL,
    mine_type VARCHAR(50) CHECK (mine_type IN ('Open Cast', 'Underground', 'Mixed')),
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    manager_name VARCHAR(255),
    contact_phone VARCHAR(50),
    operational_status VARCHAR(50) DEFAULT 'Active' CHECK (operational_status IN ('Active', 'Maintenance', 'Under Audit', 'Halted')),
    risk_score INTEGER DEFAULT 25 CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
    annual_target_tons NUMERIC(12, 2) DEFAULT 5000000.00,
    ytd_production_tons NUMERIC(12, 2) DEFAULT 0.00,
    depth NUMERIC(8, 2) DEFAULT 100.0,
    production_tpd NUMERIC(10, 2) DEFAULT 15000.0,
    workers INTEGER DEFAULT 500,
    shift VARCHAR(50) DEFAULT 'Morning (A)',
    working_hours NUMERIC(4, 2) DEFAULT 8.0,
    methane_ppm NUMERIC(8, 2) DEFAULT 300.0,
    co_ppm NUMERIC(8, 2) DEFAULT 5.0,
    co2_ppm NUMERIC(8, 2) DEFAULT 1000.0,
    dust_mg_m3 NUMERIC(8, 3) DEFAULT 0.20,
    spm_ug_m3 NUMERIC(8, 2) DEFAULT 200.0,
    temperature NUMERIC(5, 2) DEFAULT 30.0,
    humidity NUMERIC(5, 2) DEFAULT 70.0,
    ventilation_rate NUMERIC(6, 2) DEFAULT 1.5,
    water_ph NUMERIC(4, 2) DEFAULT 7.0,
    equipment_age NUMERIC(5, 2) DEFAULT 5.0,
    equipment_fault_count INTEGER DEFAULT 2,
    inspection_score NUMERIC(5, 2) DEFAULT 80.0,
    training_compliance NUMERIC(5, 2) DEFAULT 90.0,
    ppe_compliance NUMERIC(5, 2) DEFAULT 90.0,
    previous_accidents INTEGER DEFAULT 0,
    previous_near_misses INTEGER DEFAULT 0,
    open_compliance_issues INTEGER DEFAULT 0,
    days_since_last_inspection INTEGER DEFAULT 7,
    production_deviation NUMERIC(6, 2) DEFAULT 0.0,
    accident_occurred INTEGER DEFAULT 0,
    accident_severity VARCHAR(50) DEFAULT 'None',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CONTRACTORS TABLE
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100) UNIQUE NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    primary_mine_id UUID REFERENCES mines(id) ON DELETE SET NULL,
    active_workers INTEGER DEFAULT 0,
    compliance_score INTEGER DEFAULT 85 CHECK (compliance_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. WORKERS TABLE
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL,
    safety_certified BOOLEAN DEFAULT TRUE,
    certification_expiry DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMPLIANCE RULES TABLE
CREATE TABLE IF NOT EXISTS compliance_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) CHECK (category IN ('Safety', 'Environmental', 'Production', 'Labour', 'DGMS Statutory')),
    description TEXT,
    statutory_reference VARCHAR(255),
    frequency VARCHAR(50) CHECK (frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual')),
    penalty_description TEXT,
    severity VARCHAR(20) DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MINE COMPLIANCE STATUS TABLE
CREATE TABLE IF NOT EXISTS mine_compliance_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES compliance_rules(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Compliant', 'Due Soon', 'Overdue', 'Violated')),
    last_verified_at TIMESTAMP WITH TIME ZONE,
    next_due_date DATE NOT NULL,
    remarks TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mine_id, rule_id)
);

-- 7. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    inspector_name VARCHAR(255) NOT NULL,
    inspector_role VARCHAR(100) NOT NULL,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    overall_status VARCHAR(50) CHECK (overall_status IN ('Passed', 'Passed with Observations', 'Failed / Major Violations')),
    hazard_rating VARCHAR(20) CHECK (hazard_rating IN ('Low', 'Medium', 'High', 'Critical')),
    checklist_data JSONB,
    notes TEXT,
    photo_url TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    synced_from_offline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. INCIDENTS AND OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    description TEXT NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    photo_url TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Under Investigation', 'Action Required', 'Resolved', 'Closed')),
    escalated_to_corporate BOOLEAN DEFAULT FALSE,
    escalated_to_regulator BOOLEAN DEFAULT FALSE
);

-- 9. CORRECTIVE ACTIONS TABLE
CREATE TABLE IF NOT EXISTS corrective_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    action_plan TEXT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_role VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Awaiting Approval', 'Resolved')),
    signoff_by VARCHAR(255),
    signoff_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. WORKER ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    shift VARCHAR(20) CHECK (shift IN ('Morning (A)', 'Evening (B)', 'Night (C)')),
    date DATE DEFAULT CURRENT_DATE,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    synced_from_offline BOOLEAN DEFAULT FALSE
);

-- 11. DOCUMENTS & OCR TABLE
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    ocr_raw_text TEXT,
    ocr_structured_json JSONB,
    approval_status VARCHAR(50) DEFAULT 'Processed' CHECK (approval_status IN ('Pending', 'Processed', 'Verified', 'Flagged')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI RISK SCORES AND ANOMALIES
CREATE TABLE IF NOT EXISTS ai_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) CHECK (entity_type IN ('Mine', 'Contractor')),
    risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
    factors JSONB,
    anomalies JSONB,
    recommendations JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES mines(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) CHECK (alert_type IN ('Compliance Deadline', 'AI High Risk Flag', 'Gas Anomaly', 'Production Anomaly', 'Escalation Alert')),
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    message TEXT NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Unread' CHECK (status IN ('Unread', 'Acknowledged', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. TAMPER-EVIDENT AUDIT TRAIL
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_target VARCHAR(100) NOT NULL,
    details_json JSONB,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL
);

-- SEED DATA script
INSERT INTO subsidiaries (id, name, code, headquarters) VALUES
('b3333333-3333-3333-3333-333333333331', 'Bharat Coking Coal Limited (BCCL)', 'BCCL', 'Dhanbad, Jharkhand'),
('b3333333-3333-3333-3333-333333333332', 'Eastern Coalfields Limited (ECL)', 'ECL', 'Sanctoria, West Bengal'),
('b3333333-3333-3333-3333-333333333333', 'Mahanadi Coalfields Limited (MCL)', 'MCL', 'Sambalpur, Odisha'),
('b3333333-3333-3333-3333-333333333334', 'Central Coalfields Limited (CCL)', 'CCL', 'Ranchi, Jharkhand')
ON CONFLICT (code) DO NOTHING;

INSERT INTO mines (id, name, code, subsidiary_id, mine_type, latitude, longitude, location_name, state, manager_name, contact_phone, operational_status, risk_score, risk_level) VALUES
('c1111111-1111-1111-1111-111111111111', 'Jharia Open Cast Mine Pit-3', 'JHR-OCP3', 'b3333333-3333-3333-3333-333333333331', 'Open Cast', 23.7500, 86.4167, 'Jharia, Dhanbad', 'Jharkhand', 'Rajesh Sharma', '+91 9876543210', 'Active', 78, 'High'),
('c2222222-2222-2222-2222-222222222222', 'Raniganj Underground Mine Shaft-2', 'RNG-UG2', 'b3333333-3333-3333-3333-333333333332', 'Underground', 23.6167, 87.1333, 'Raniganj, Paschim Bardhaman', 'West Bengal', 'Amitabh Roy', '+91 9876543211', 'Active', 35, 'Low'),
('c3333333-3333-3333-3333-333333333333', 'Talcher Open Cast Mine', 'TLC-OCP1', 'b3333333-3333-3333-3333-333333333333', 'Open Cast', 20.9500, 85.2167, 'Talcher, Angul', 'Odisha', 'Suresh Patnaik', '+91 9876543212', 'Active', 62, 'Moderate'),
('c4444444-4444-4444-4444-444444444444', 'North Karanpura Opencast Project', 'NKP-OCP', 'b3333333-3333-3333-3333-333333333334', 'Open Cast', 23.8500, 85.1500, 'Chatra/Hazaribagh', 'Jharkhand', 'Vikram Singh', '+91 9876543213', 'Active', 88, 'Critical')
ON CONFLICT (code) DO NOTHING;
