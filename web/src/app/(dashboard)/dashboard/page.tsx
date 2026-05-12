"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { getDashboardStats, getWorkOrders, getSchedule } from "@/lib/data"
import { useEffect, useState } from "react"

const MOCK_COMPANY_ID = "11111111-1111-1111-1111-111111111111"

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([])
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
  const [todaySchedule, setTodaySchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date().toISOString().split("T")[0]
        const dashboardStats = await getDashboardStats(MOCK_COMPANY_ID)
        
        const statsData = [
          {
            title: "Total de Clientes",
            value: String(dashboardStats.totalClients),
            change: "+0%",
            trend: "up",
            icon: Users,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            title: "OS este mês",
            value: String(dashboardStats.totalWorkOrders),
            change: "+0%",
            trend: "up",
            icon: ClipboardList,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            title: "Faturamento",
            value: formatCurrency(dashboardStats.monthlyRevenue),
            change: "+0%",
            trend: "up",
            icon: DollarSign,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            title: "NPS",
            value: "0",
            change: "+0",
            trend: "up",
            icon: BarChart3,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
          },
        ]

        setStats(statsData)

        const orders = await getWorkOrders(MOCK_COMPANY_ID)
        setRecentWorkOrders(orders.slice(0, 5))

        const schedule = await getSchedule(MOCK_COMPANY_ID, today)
        setTodaySchedule(schedule.slice(0, 5))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">SmartPrag Dashboard</h1>
          <p className="text-[#64748b] text-lg">Visão geral das operações</p>
        </div>
        <Link href="/work-orders/new">
          <button className="inline-flex items-center gap-2 bg-[#003d73] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#002a50] transition-all shadow-sm">
            <Plus className="h-5 w-5" />
            Nova OS
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 font-medium mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-6 text-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-bold">
                      {stat.change}
                    </span>
                    <span className="text-slate-400 ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`h-14 w-14 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-slate-50">
            <CardTitle className="text-xl font-bold text-slate-800">Ordens de Serviço</CardTitle>
            <Link href="/work-orders" className="text-sm text-[#003d73] hover:underline font-bold flex items-center gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentWorkOrders.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Nenhuma ordem de serviço</p>
                <p className="text-slate-400 text-sm">Crie uma nova OS para começar</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentWorkOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{order.client?.name || "Cliente"}</p>
                        <p className="text-sm text-slate-500">{order.service_type?.name || "Serviço"}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-xs text-slate-400 font-medium">
                        {order.scheduled_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-slate-50">
            <CardTitle className="text-xl font-bold text-slate-800">Agenda de Hoje</CardTitle>
            <Link href="/schedule" className="text-sm text-[#003d73] hover:underline font-bold flex items-center gap-1">
              Ver agenda <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-8">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-10">
                <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Sem agendamentos</p>
              </div>
            ) : (
              <div className="space-y-8">
                {todaySchedule.map((service, idx) => (
                  <div key={service.id} className="flex gap-4 relative">
                    {idx !== todaySchedule.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-[-32px] w-[1px] bg-slate-100" />
                    )}
                    <div className="z-10 h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="pb-2">
                      <p className="font-bold text-slate-800">{service.client?.name || "Cliente"}</p>
                      <p className="text-sm text-slate-500 mb-2">{service.service_type?.name || "Serviço"}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {service.technician?.name || "Técnico"}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{service.scheduled_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}