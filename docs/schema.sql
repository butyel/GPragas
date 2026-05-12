-- GPRAGAS Database Schema - Multi-tenant PostgreSQL (Supabase)
-- Version: 1.0.0
-- Phase: MVP

-- ============================================
-- COMPANIES (Multi-tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    document TEXT, -- CNPJ
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    logo_url TEXT,
    license_number TEXT, -- Vigilância Sanitária
    plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'business', 'franchise')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- ============================================
-- USERS (Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'technician', 'viewer', 'franchise_owner')),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    pin_hash TEXT, -- For mobile app
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENTS (CRM)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('pf', 'pj')),
    document TEXT NOT NULL, -- CPF ou CNPJ
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    phone_secondary TEXT,
    contact_name TEXT, -- Responsável
    address TEXT,
    address_number TEXT,
    address_complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    geolocation_lat DECIMAL(10, 8),
    geolocation_lng DECIMAL(11, 8),
    segment TEXT CHECK (segment IN ('residential', 'commercial', 'industrial', 'food_service', 'hospital')),
    tags TEXT[], -- Array de tags
    notes TEXT,
    score INTEGER DEFAULT 100, -- Churn risk score
    source TEXT, -- Origen: google, referral, social, etc
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================
-- PRODUCTS (Catalog)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    active_ingredient TEXT, -- Princípio ativo
    registration_mapa TEXT, -- Registro MAPA/ANVISA
    concentration TEXT,
    manufacturer TEXT, -- Fabricante
    supplier TEXT,
    unit TEXT, -- kg, L, etc
    cost_price DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),
    min_stock INTEGER DEFAULT 0,
    expiration_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICE TYPES
-- ============================================
CREATE TABLE IF NOT EXISTS service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Desinsetização, Desratização, etc
    description TEXT,
    target_pests TEXT[], -- Pragas-alvo
    default_duration_minutes INTEGER DEFAULT 60,
    base_price DECIMAL(10, 2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TECHNICIANS
-- ============================================
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    document TEXT, -- CPF
    registration_number TEXT, -- Registro profissional
    certifications TEXT[], -- NR33, NR35, etc
    certification_expiry DATE[],
    training_completed TEXT[],
   epi_assigned BOOLEAN DEFAULT false,
    max_daily_services INTEGER DEFAULT 8,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORK ORDERS (OS)
-- ============================================
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    service_type_id UUID REFERENCES service_types(id),
    technician_id UUID REFERENCES technicians(id),
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    scheduled_end_time TIME,
    
    -- Status
    status TEXT DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_transit', 'in_progress', 'completed', 
        'pending_report', 'cancelled', 'rescheduled'
    )),
    
    -- Location
    address TEXT,
    address_number TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    geolocation_open_lat DECIMAL(10, 8),
    geolocation_open_lng DECIMAL(11, 8),
    geolocation_close_lat DECIMAL(10, 8),
    geolocation_close_lng DECIMAL(11, 8),
    
    -- Details
    target_pests TEXT[],
    description TEXT,
    observations TEXT,
    
    -- Execution
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    signature_url TEXT,
    signature_name TEXT,
    signature_date TIMESTAMPTZ,
    
    -- Financial
    value DECIMAL(10, 2),
    cost_products DECIMAL(10, 2),
    cost_technician DECIMAL(10, 2),
    
    -- Report
    report_url TEXT,
    report_generated_at TIMESTAMPTZ,
    report_valid_until DATE,
    qr_code_url TEXT,
    
    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES users(id),
    cancel_reason TEXT
);

-- ============================================
-- WORK ORDER ITEMS (Products used)
-- ============================================
CREATE TABLE IF NOT EXISTS work_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(10, 3),
    dosage TEXT,
    application_method TEXT,
    lot_number TEXT
);

-- ============================================
-- WORK ORDER PHOTOS
-- ============================================
CREATE TABLE IF NOT EXISTS work_order_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('before', 'after', 'during', 'evidence')),
    url TEXT NOT NULL,
    description TEXT,
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8)
);

-- ============================================
-- SCHEDULES (Calendar)
-- ============================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id),
    title TEXT,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    all_day BOOLEAN DEFAULT false,
    color TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTS (Laudos Técnicos)
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    
    report_number TEXT NOT NULL,
    report_type TEXT CHECK (report_type IN ('dedetization', 'sanitary', 'mip', 'certification')),
    
    -- Content (JSON for flexibility)
    content JSONB,
    generated_text TEXT, -- AI generated text
    
    -- Files
    pdf_url TEXT,
    qr_code TEXT,
    
    -- Validity
    issue_date DATE NOT NULL,
    valid_until DATE,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'sent', 'expired')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    sent_to TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTRACTS (Recurring Services)
-- ============================================
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id),
    
    contract_number TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    
    -- Terms
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    frequency TEXT CHECK (frequency IN ('monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual')),
    monthly_value DECIMAL(10, 2),
    
    -- Services included
    services JSONB, -- Array of service types
    
    -- Auto-renewal
    auto_renew BOOLEAN DEFAULT true,
    renewal_notice_days INTEGER DEFAULT 30,
    
    -- Financial
    payment_method TEXT,
    billing_day INTEGER DEFAULT 5,
    
    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FINANCIAL (Future - Phase 2)
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id),
    work_order_id UUID REFERENCES work_orders(id),
    client_id UUID REFERENCES clients(id),
    
    invoice_number TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    value DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    fine DECIMAL(10, 2),
    interest DECIMAL(10, 2),
    total_value DECIMAL(10, 2),
    
    payment_method TEXT,
    pix_code TEXT,
    barcode TEXT,
    
    nfe_id TEXT, -- NFS-e integration
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNICATIONS (WhatsApp, Email logs)
-- ============================================
CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id),
    work_order_id UUID REFERENCES work_orders(id),
    
    type TEXT CHECK (type IN ('whatsapp', 'email', 'sms')),
    direction TEXT CHECK (direction IN ('outbound', 'inbound')),
    template TEXT, -- Template usado
    subject TEXT,
    body TEXT,
    
    status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    external_id TEXT, -- ID do provedor (Twilio, etc)
    
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS (All critical actions)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    ip_address TEXT,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_company ON work_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_technician ON work_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_scheduled_date ON work_orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_schedules_technician_date ON schedules(technician_id, start_date);
CREATE INDEX IF NOT EXISTS idx_reports_company ON reports(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Multi-tenant
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current company_id
CREATE OR REPLACE FUNCTION company_id()
RETURNS UUID AS $$
    SELECT COALESCE(
        (SELECT company_id FROM public.users WHERE id = auth.uid() LIMIT 1),
        '11111111-1111-1111-1111-111111111111'::UUID
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Companies: everyone can read, only super admin can modify
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (true);

-- Users: only own company data
DROP POLICY IF EXISTS "Users can see own company" ON users;
CREATE POLICY "Users can see own company" ON users
    FOR SELECT USING (company_id = company_id());

DROP POLICY IF EXISTS "Users can insert own company" ON users;
CREATE POLICY "Users can insert own company" ON users
    FOR INSERT WITH CHECK (company_id = company_id());

DROP POLICY IF EXISTS "Users can update own company" ON users;
CREATE POLICY "Users can update own company" ON users
    FOR UPDATE USING (company_id = company_id());

-- Clients
DROP POLICY IF EXISTS "Clients visible to company" ON clients;
CREATE POLICY "Clients visible to company" ON clients
    FOR ALL USING (company_id = company_id());

-- Work Orders
DROP POLICY IF EXISTS "Work orders visible to company" ON work_orders;
CREATE POLICY "Work orders visible to company" ON work_orders
    FOR ALL USING (company_id = company_id());

-- Schedules
DROP POLICY IF EXISTS "Schedules visible to company" ON schedules;
CREATE POLICY "Schedules visible to company" ON schedules
    FOR ALL USING (company_id = company_id());

-- Reports
DROP POLICY IF EXISTS "Reports visible to company" ON reports;
CREATE POLICY "Reports visible to company" ON reports
    FOR ALL USING (company_id = company_id());

-- Products
DROP POLICY IF EXISTS "Products visible to company" ON products;
CREATE POLICY "Products visible to company" ON products
    FOR ALL USING (company_id = company_id());

-- Technicians
DROP POLICY IF EXISTS "Technicians visible to company" ON technicians;
CREATE POLICY "Technicians visible to company" ON technicians
    FOR ALL USING (company_id = company_id());

-- Service Types
DROP POLICY IF EXISTS "Service types visible to company" ON service_types;
CREATE POLICY "Service types visible to company" ON service_types
    FOR ALL USING (company_id = company_id());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('photos', 'photos', true),
    ('reports', 'reports', true),
    ('signatures', 'signatures', true),
    ('logos', 'logos', true);

-- ============================================
-- STORAGE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Photos accessible to company" ON storage.objects;
CREATE POLICY "Photos accessible to company" ON storage.objects
    FOR ALL USING (
        bucket_id = 'photos' 
        AND (storage.foldername(name))[1] = COALESCE(company_id()::text, '')
    );

DROP POLICY IF EXISTS "Reports accessible to company" ON storage.objects;
CREATE POLICY "Reports accessible to company" ON storage.objects
    FOR ALL USING (
        bucket_id = 'reports' 
        AND (storage.foldername(name))[1] = COALESCE(company_id()::text, '')
    );

DROP POLICY IF EXISTS "Signatures accessible to company" ON storage.objects;
CREATE POLICY "Signatures accessible to company" ON storage.objects
    FOR ALL USING (
        bucket_id = 'signatures' 
        AND (storage.foldername(name))[1] = COALESCE(company_id()::text, '')
    );

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_work_orders_updated_at ON work_orders;
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUDIT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (company_id, user_id, action, table_name, record_id, new_values)
        VALUES (
            COALESCE(NEW.company_id, company_id()),
            nullif(current_setting('app.current_user_id', true), '')::UUID,
            'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (company_id, user_id, action, table_name, record_id, old_values, new_values)
        VALUES (
            COALESCE(NEW.company_id, company_id()),
            nullif(current_setting('app.current_user_id', true), '')::UUID,
            'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (company_id, user_id, action, table_name, record_id, old_values)
        VALUES (
            COALESCE(OLD.company_id, company_id()),
            nullif(current_setting('app.current_user_id', true), '')::UUID,
            'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Demo Company)
-- ============================================
INSERT INTO companies (id, name, slug, document, phone, email, license_number, plan)
VALUES ('11111111-1111-1111-1111-111111111111', 'Demo Pest Control', 'demo-pest', '12.345.678/0001-90', '(11) 99999-9999', 'contato@demopest.com.br', 'VISA-12345', 'pro')
ON CONFLICT (slug) DO NOTHING;

-- Demo user (password: demo123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password_hash, full_name, role, company_id)
VALUES ('admin@demopest.com.br', '$2a$10$placeholder', 'Admin Demo', 'admin', (SELECT id FROM companies WHERE slug = 'demo-pest'))
ON CONFLICT (email) DO NOTHING;

-- Demo service types
INSERT INTO service_types (company_id, name, description, target_pests, default_duration_minutes, base_price)
SELECT id, 'Desinsetização', 'Eliminação de insetos (baratas, formigas, mosquitos, etc)', ARRAY['baratas', 'formigas', 'mosquitos', 'cupins'], 60, 150.00
FROM companies WHERE slug = 'demo-pest';

INSERT INTO service_types (company_id, name, description, target_pests, default_duration_minutes, base_price)
SELECT id, 'Desratização', 'Eliminação de ratos e roedores', ARRAY['ratos', 'camundongos'], 90, 180.00
FROM companies WHERE slug = 'demo-pest';

INSERT INTO service_types (company_id, name, description, target_pests, default_duration_minutes, base_price)
SELECT id, 'Dedetização Comercial', 'Serviço comercial com garantia', ARRAY['baratas', 'formigas', 'mosquitos', 'ratos'], 120, 250.00
FROM companies WHERE slug = 'demo-pest';
