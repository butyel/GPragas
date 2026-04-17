# GPRAGAS - Sistema de Gestão para Controle de Pragas

## 1. Project Overview

**Project Name:** GPRAGAS  
**Type:** SaaS B2B Multi-tenant Web Application  
**Core Functionality:** Complete management platform for urban pest control companies (dedetizadoras) in Brazil, including CRM, scheduling, work orders, technical reports, and field technician mobile app.  
**Target Users:** Pest control companies (1-10,000 employees), field technicians, managers, and clients.

---

## 2. UI/UX Specification

### Layout Structure

**Main Application Shell:**
- Collapsible sidebar navigation (280px expanded, 80px collapsed)
- Top header bar with company logo, search, notifications, user menu
- Main content area with breadcrumbs
- Responsive: sidebar becomes bottom nav on mobile

**Page Sections:**
- Dashboard: KPIs cards, charts, activity feed
- Lists: Data tables with filters, bulk actions
- Forms: Multi-step wizards for complex flows
- Kanban: Drag-and-drop boards for CRM/Operations

**Responsive Breakpoints:**
- Mobile: < 640px (single column, bottom nav)
- Tablet: 640px - 1024px (collapsible sidebar)
- Desktop: > 1024px (full sidebar)

### Visual Design

**Color Palette:**
```
--primary: #0F766E (Teal 700 - trust, professionalism)
--primary-light: #14B8A6 (Teal 500)
--primary-dark: #0D9488 (Teal 600)
--secondary: #F97316 (Orange 500 - action, alerts)
--accent: #8B5CF6 (Violet 500 - highlights)
--background: #F8FAFC (Slate 50)
--surface: #FFFFFF
--surface-elevated: #F1F5F9 (Slate 100)
--text-primary: #0F172A (Slate 900)
--text-secondary: #64748B (Slate 500)
--text-muted: #94A3B8 (Slate 400)
--border: #E2E8F0 (Slate 200)
--success: #10B981 (Emerald 500)
--warning: #F59E0B (Amber 500)
--error: #EF4444 (Red 500)
--info: #3B82F6 (Blue 500)
```

**Typography:**
- Headings: Inter (700), sizes: h1=32px, h2=24px, h3=20px, h4=16px
- Body: Inter (400), 14px base, 16px for emphasis
- Mono: JetBrains Mono for codes, IDs
- Line height: 1.5 for body, 1.2 for headings

**Spacing System:**
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Card padding: 24px
- Section gaps: 32px
- Form gaps: 16px

**Visual Effects:**
- Card shadows: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Elevated shadows: `0 10px 15px -3px rgba(0,0,0,0.1)`
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 150ms ease-in-out for interactions

### Components

**Navigation:**
- Sidebar with icons + labels, active state with primary color bg
- Breadcrumbs with back navigation
- Tab navigation for sub-sections

**Data Display:**
- Tables: sortable columns, pagination, row actions
- Cards: KPI cards with icon, value, trend indicator
- Charts: Line, bar, pie using Recharts
- Status badges: colored pills (pending=amber, active=green, etc.)

**Forms:**
- Input fields with labels, validation states, helper text
- Select dropdowns with search
- Date/time pickers
- File upload with preview
- Signature canvas for digital signatures

**Interactive:**
- Buttons: primary (filled), secondary (outlined), ghost
- Drag-and-drop for Kanban, calendar
- Modals for confirmations, forms
- Toast notifications for feedback

---

## 3. Functionality Specification

### Core Features (MVP - Phase 1)

**1. Authentication & Multi-tenant:**
- Login with email/password
- Company selection on login (if user has access to multiple)
- Row-level security: users see only their company data
- Role-based access: Admin, Manager, Technician, Viewer

**2. Client Management (CRM):**
- Create/edit clients (PF or PJ)
- Fields: name, document (CPF/CNPJ), phone, email, address
- Client tags: residential, commercial, industrial, food service, hospital
- Client history: services, payments, communications
- Client scoring: risk of churn based on service frequency

**3. Work Orders (OS - Ordens de Serviço):**
- Create OS: select client, service type, target pest, technician, date/time
- Status workflow: Scheduled → In Transit → In Progress → Completed → Pending Report
- Technician fills: products used, quantities, conditions, photos, notes
- Client signature capture on completion
- Geolocation tracking on open/close
- Before/after photos required

**4. Scheduling & Calendar:**
- Calendar view: day, week, month
- Filter by technician
- Drag-and-drop rescheduling
- Conflict detection for double booking
- Visual Kanban board for operation pipeline

**5. Technical Reports (Laudos):**
- Auto-generate PDF report after OS completion
- Template includes: client info, service details, products used (with ANVISA registration), technician signature
- QR code for authenticity verification
- Report storage in cloud with shareable link

**6. Mobile App (Technician):**
- Login with PIN/biometric
- Today's schedule with route map
- Open OS: fill data, take photos, capture signature
- Offline mode: works without internet, syncs when back online

### Phase 2 Features (Future)

- Financial module: invoices, payments,receivables
- Recurring contracts
- Client portal
- WhatsApp automation
- AI-assisted report generation

---

## 4. Technical Architecture

**Frontend (Web):**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation
- Recharts for analytics

**Backend:**
- Next.js API Routes (serverless)
- Supabase for database, auth, storage
- Edge Functions for complex logic

**Database Schema (Supabase PostgreSQL):**
- companies (multi-tenant)
- users (company association)
- clients
- work_orders (OS)
- work_order_items (products used)
- work_order_photos
- schedules
- reports (laudos)
- products (catalog)
- technicians

**Storage:**
- Supabase Storage buckets: reports, photos, signatures

---

## 5. Acceptance Criteria

- [ ] User can sign up/login and select their company
- [ ] Admin can create and manage clients
- [ ] Manager can create work orders and assign technicians
- [ ] Calendar displays scheduled services with drag-drop
- [ ] Technician can complete OS on mobile with photos/signature
- [ ] PDF report generates automatically with QR code
- [ ] All data filtered by company (multi-tenant security)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Offline-capable mobile app for field technicians