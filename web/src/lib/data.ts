import { supabase } from "./supabase"

export async function getClients(companyId: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", companyId)
    .order("name")

  if (error) throw error
  return data
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getWorkOrders(companyId: string, filters?: {
  status?: string
  technicianId?: string
  dateFrom?: string
  dateTo?: string
}) {
  let query = supabase
    .from("work_orders")
    .select(`
      *,
      client:clients(name, document),
      technician:technicians(user_id, name)
    `)
    .eq("company_id", companyId)
    .order("scheduled_date", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.technicianId) {
    query = query.eq("technician_id", filters.technicianId)
  }
  if (filters?.dateFrom) {
    query = query.gte("scheduled_date", filters.dateFrom)
  }
  if (filters?.dateTo) {
    query = query.lte("scheduled_date", filters.dateTo)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from("work_orders")
    .select(`
      *,
      client:clients(*),
      technician:technicians(*),
      service_type:services(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getTechnicians(companyId: string) {
  const { data, error } = await supabase
    .from("technicians")
    .select(`
      *,
      user:users(full_name)
    `)
    .eq("company_id", companyId)
    .eq("active", true)
    .order("name")

  if (error) throw error
  return data
}

export async function getDashboardStats(companyId: string) {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  const [clientsCount, workOrdersCount, completedCount, revenueResult] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("company_id", companyId),
    supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("company_id", companyId).gte("scheduled_date", firstDayOfMonth).lte("scheduled_date", lastDayOfMonth),
    supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "completed").gte("scheduled_date", firstDayOfMonth).lte("scheduled_date", lastDayOfMonth),
    supabase.from("work_orders").select("value").eq("company_id", companyId).eq("status", "completed").gte("scheduled_date", firstDayOfMonth).lte("scheduled_date", lastDayOfMonth)
  ])

  const monthlyRevenue = revenueResult.data?.reduce((sum, wo) => sum + (wo.value || 0), 0) || 0

  return {
    totalClients: clientsCount.count || 0,
    totalWorkOrders: workOrdersCount.count || 0,
    completedWorkOrders: completedCount.count || 0,
    monthlyRevenue
  }
}

export async function getSchedule(companyId: string, date: string) {
  const { data, error } = await supabase
    .from("work_orders")
    .select(`
      *,
      client:clients(name),
      technician:technicians(name)
    `)
    .eq("company_id", companyId)
    .eq("scheduled_date", date)
    .order("scheduled_time")

  if (error) throw error
  return data
}

export async function getReports(companyId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select(`
      *,
      work_order:work_orders(
        id,
        client:clients(name),
        service_type:services(name)
      )
    `)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}