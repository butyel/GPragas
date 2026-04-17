export interface Company {
  id: string
  name: string
  slug: string
  document?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  logo_url?: string
  license_number?: string
  plan: 'starter' | 'pro' | 'business' | 'franchise'
  created_at: string
  updated_at: string
  active: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'technician' | 'viewer' | 'franchise_owner'
  company_id: string
  active: boolean
  pin_hash?: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  company_id: string
  type: 'pf' | 'pj'
  document: string
  name: string
  email?: string
  phone?: string
  phone_secondary?: string
  contact_name?: string
  address?: string
  address_number?: string
  address_complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  geolocation_lat?: number
  geolocation_lng?: number
  segment?: 'residential' | 'commercial' | 'industrial' | 'food_service' | 'hospital'
  tags?: string[]
  notes?: string
  score: number
  source?: string
  created_at: string
  updated_at: string
  created_by?: string
}

export interface ServiceType {
  id: string
  company_id: string
  name: string
  description?: string
  target_pests?: string[]
  default_duration_minutes: number
  base_price: number
  active: boolean
  created_at: string
}

export interface Technician {
  id: string
  user_id?: string
  company_id: string
  document?: string
  registration_number?: string
  certifications?: string[]
  certification_expiry?: string[]
  training_completed?: string[]
  epi_assigned: boolean
  max_daily_services: number
  active: boolean
  created_at: string
  updated_at: string
  user?: User
}

export interface WorkOrder {
  id: string
  company_id: string
  client_id?: string
  service_type_id?: string
  technician_id?: string
  scheduled_date: string
  scheduled_time: string
  scheduled_end_time?: string
  status: WorkOrderStatus
  address?: string
  address_number?: string
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  geolocation_open_lat?: number
  geolocation_open_lng?: number
  geolocation_close_lat?: number
  geolocation_close_lng?: number
  target_pests?: string[]
  description?: string
  observations?: string
  started_at?: string
  finished_at?: string
  signature_url?: string
  signature_name?: string
  signature_date?: string
  value?: number
  cost_products?: number
  cost_technician?: number
  report_url?: string
  report_generated_at?: string
  report_valid_until?: string
  qr_code_url?: string
  created_by?: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  cancelled_by?: string
  cancel_reason?: string
  client?: Client
  service_type?: ServiceType
  technician?: Technician
  items?: WorkOrderItem[]
  photos?: WorkOrderPhoto[]
}

export type WorkOrderStatus = 
  | 'scheduled'
  | 'in_transit'
  | 'in_progress'
  | 'completed'
  | 'pending_report'
  | 'cancelled'
  | 'rescheduled'

export interface WorkOrderItem {
  id: string
  work_order_id: string
  product_id?: string
  quantity?: number
  dosage?: string
  application_method?: string
  lot_number?: string
  product?: Product
}

export interface WorkOrderPhoto {
  id: string
  work_order_id: string
  type: 'before' | 'after' | 'during' | 'evidence'
  url: string
  description?: string
  taken_at: string
  lat?: number
  lng?: number
}

export interface Product {
  id: string
  company_id: string
  name: string
  active_ingredient?: string
  registration_mapa?: string
  concentration?: string
  manufacturer?: string
  supplier?: string
  unit?: string
  cost_price?: number
  sale_price?: number
  min_stock: number
  expiration_date?: string
  active: boolean
  created_at: string
}

export interface Schedule {
  id: string
  company_id: string
  work_order_id?: string
  technician_id?: string
  title?: string
  start_date: string
  start_time: string
  end_time?: string
  all_day: boolean
  color?: string
  reminder_sent: boolean
  confirmed: boolean
  confirmed_at?: string
  confirmed_by?: string
  created_at: string
  updated_at: string
  work_order?: WorkOrder
  technician?: Technician
}

export interface Report {
  id: string
  company_id: string
  work_order_id?: string
  report_number: string
  report_type: 'dedetization' | 'sanitary' | 'mip' | 'certification'
  content?: Record<string, unknown>
  generated_text?: string
  pdf_url?: string
  qr_code?: string
  issue_date: string
  valid_until?: string
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'expired'
  approved_by?: string
  approved_at?: string
  sent_at?: string
  sent_to?: string
  created_at: string
  updated_at: string
  work_order?: WorkOrder
}

export interface Contract {
  id: string
  company_id: string
  client_id?: string
  contract_number: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  start_date: string
  end_date: string
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual'
  monthly_value: number
  services?: Record<string, unknown>[]
  auto_renew: boolean
  renewal_notice_days: number
  payment_method?: string
  billing_day: number
  created_by?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Invoice {
  id: string
  company_id: string
  contract_id?: string
  work_order_id?: string
  client_id?: string
  invoice_number: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date?: string
  value: number
  discount?: number
  fine?: number
  interest?: number
  total_value: number
  payment_method?: string
  pix_code?: string
  barcode?: string
  nfe_id?: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalClients: number
  totalWorkOrders: number
  pendingWorkOrders: number
  completedWorkOrders: number
  monthlyRevenue: number
  nps: number
  newClientsThisMonth: number
}