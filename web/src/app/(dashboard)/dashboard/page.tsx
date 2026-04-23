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
} from "lucide-react"
import Link from "next/link"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { getDashboardStats, getWorkOrders, getSchedule } from "@/lib/data"
import { useEffect, useState } from "react"

const MOCK_COMPANY_ID = "demo-company"

interface Stat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  color: string
}

const statColors = [
  "from-blue-500 to-blue-600",
  "from-primary to-primary/80",
  "from-accent to-amber-400",
  "from-violet-500 to-purple-600",
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
  const [todaySchedule, setTodaySchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date().toISOString().split("T")[0]
        
        const dashboardStats = await getDashboardStats(MOCK_COMPANY_ID)
        
        const statsData: Stat[] = [
          {
            title: "Total de Clientes",
            value: String(dashboardStats.totalClients),
            change: "+0%",
            trend: "up",
            icon: Users,
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "OS este mês",
            value: String(dashboardStats.totalWorkOrders),
            change: "+0%",
            trend: "up",
            icon: ClipboardList,
            color: "from-primary to-primary/80",
          },
          {
            title: "Faturamento",
            value: formatCurrency(dashboardStats.monthlyRevenue),
            change: "+0%",
            trend: "up",
            icon: DollarSign,
            color: "from-accent to-amber-400",
          },
          {
            title: "Técnicos Ativos",
            value: String(dashboardStats.activeTechnicians || 0),
            change: "+0",
            trend: "up",
            icon: TrendingUp,
            color: "from-violet-500 to-purple-600",
          },
        ]

        setStats(statsData)

        const orders = await getWorkOrders(MOCK_COMPANY_ID)
        setRecentWorkOrders(orders.slice(0, 5))

        const schedule = await getSchedule(MOCK_COMPANY_ID, today)
        setTodaySchedule(schedule.slice(0, 5))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setStats([
          { title: "Total de Clientes", value: "0", change: "+0%", trend: "up", icon: Users, color: "from-blue-500 to-blue-600" },
          { title: "OS este mês", value: "0", change: "+0%", trend: "up", icon: ClipboardList, color: "from-primary to-primary/80" },
          { title: "Faturamento", value: "R$ 0", change: "+0%", trend: "up", icon: DollarSign, color: "from-accent to-amber-400" },
          { title: "Técnicos Ativos", value: "0", change: "+0", trend: "up", icon: TrendingUp, color: "from-violet-500 to-purple-600" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const quickActions = [
    { href: "/clients/new", icon: Users, label: "Novo Cliente", desc: "Cadastrar cliente", color: "bg-green-100 text-green-600" },
    { href: "/work-orders/new", icon: ClipboardList, label: "Nova OS", desc: "Criar ordem de serviço", color: "bg-blue-100 text-blue-600" },
    { href: "/schedule", icon: Calendar, label: "Agendar", desc: "Agendar serviço", color: "bg-purple-100 text-purple-600" },
    { href: "/reports", icon: CheckCircle2, label: "Laudos", desc: "Ver relatórios", color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das operações</p>
        </div>
        <Link href="/work-orders/new">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-glow transition-all">
            <Plus className="h-5 w-5" />
            Nova OS
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="shadow-card hover:shadow-card-hover transition-all duration-300 border-0 overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                  <div className="flex items-center mt-3 text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                    )}
                    <span className={stat.trend === "up" ? "text-success font-medium" : "text-destructive font-medium"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-5">
            <CardTitle className="text-lg font-semibold text-foreground">Ordens de Serviço</CardTitle>
            <Link href="/work-orders" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-muted" />
                      <div>
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentWorkOrders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="h-7 w-7 opacity-50" />
                </div>
                <p className="font-medium">Nenhuma ordem de serviço encontrada</p>
                <p className="text-sm mt-1">Crie sua primeira OS para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentWorkOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{order.client?.name || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{order.service_type?.name || "Serviço"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.scheduled_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-5">
            <CardTitle className="text-lg font-semibold text-foreground">Agenda de Hoje</CardTitle>
            <Link href="/schedule" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              Ver agenda <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-9 w-9 rounded-xl bg-muted animate-pulse" />
                      <div className="w-0.5 h-full bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-24 bg-muted rounded mt-2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : todaySchedule.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 opacity-50" />
                </div>
                <p className="font-medium">Nenhum serviço agendado para hoje</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.map((service: any) => (
                  <div key={service.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="w-0.5 flex-1 bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="font-medium text-sm text-foreground">{service.client?.name || "Cliente"}</p>
                      <p className="text-xs text-muted-foreground">{service.service_type?.name || "Serviço"}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                          {service.technician?.name || "Técnico"}
                        </span>
                        <span className="text-xs text-muted-foreground">{service.scheduled_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border-0 group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}