const MOCK_CLIENTS: any[] = []

const MOCK_WORK_ORDERS: any[] = []

const MOCK_TECHNICIANS: any[] = []

const MOCK_PRODUCTS: any[] = []

const MOCK_CONTRACTS: any[] = []

const MOCK_VEHICLES: any[] = []

const MOCK_QUOTES: any[] = []

const MOCK_INVOICES: any[] = []

const MOCK_REPORTS: any[] = []

const MOCK_COMMUNICATIONS: any[] = []

export async function getClients(companyId: string) {
  return MOCK_CLIENTS
}

export async function getClientById(id: string) {
  return MOCK_CLIENTS.find(c => c.id === id) || null
}

export async function getWorkOrders(companyId: string, filters?: {
  status?: string
  technicianId?: string
  dateFrom?: string
  dateTo?: string
}) {
  let data = MOCK_WORK_ORDERS
  if (filters?.status) {
    data = data.filter(o => o.status === filters.status)
  }
  return data
}

export async function getWorkOrderById(id: string) {
  return MOCK_WORK_ORDERS.find(o => o.id === id) || null
}

export async function getTechnicians(companyId: string) {
  return MOCK_TECHNICIANS
}

export async function getDashboardStats(companyId: string) {
  return {
    totalClients: MOCK_CLIENTS.length,
    totalWorkOrders: MOCK_WORK_ORDERS.length,
    completedWorkOrders: MOCK_WORK_ORDERS.filter(o => o.status === "completed").length,
    monthlyRevenue: MOCK_WORK_ORDERS.reduce((sum, wo) => sum + (wo.value || 0), 0),
    totalTechnicians: MOCK_TECHNICIANS.length,
    activeTechnicians: MOCK_TECHNICIANS.filter(t => t.status === "active").length,
    totalVehicles: MOCK_VEHICLES.length,
    activeVehicles: MOCK_VEHICLES.filter(v => v.status === "active").length,
  }
}

export async function getSchedule(companyId: string, date: string) {
  return MOCK_WORK_ORDERS.filter(o => o.scheduled_date === date)
}

export async function getReports(companyId: string) {
  return MOCK_REPORTS
}

export async function getProducts(companyId: string) {
  return MOCK_PRODUCTS
}

export async function getProductById(id: string) {
  return MOCK_PRODUCTS.find(p => p.id === id) || null
}

export async function getContracts(companyId: string) {
  return MOCK_CONTRACTS
}

export async function getContractById(id: string) {
  return MOCK_CONTRACTS.find(c => c.id === id) || null
}

export async function getInvoices(companyId: string) {
  return MOCK_INVOICES
}

export async function getInvoiceById(id: string) {
  return MOCK_INVOICES.find(i => i.id === id) || null
}

export async function getVehicles(companyId: string) {
  return MOCK_VEHICLES
}

export async function getQuotes(companyId: string) {
  return MOCK_QUOTES
}

export async function getCommunications(companyId: string) {
  return MOCK_COMMUNICATIONS
}