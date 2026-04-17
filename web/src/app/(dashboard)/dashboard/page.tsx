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
} from "lucide-react"
import Link from "next/link"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { getDashboardStats, getWorkOrders } from "@/lib/data"
import { useEffect, useState } from "react"

const MOCK_COMPANY_ID = "demo-company"

interface Stat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardStats = await getDashboardStats(MOCK_COMPANY_ID)
        
        const statsData: Stat[] = [
          {
            title: "Total de Clientes",
            value: String(dashboardStats.totalClients),
            change: "+12%",
            trend: "up",
            icon: Users,
          },
          {
            title: "OS este mês",
            value: String(dashboardStats.totalWorkOrders),
            change: "+8%",
            trend: "up",
            icon: ClipboardList,
          },
          {
            title: "Faturamento",
            value: formatCurrency(dashboardStats.monthlyRevenue),
            change: "+15%",
            trend: "up",
            icon: DollarSign,
          },
          {
            title: "NPS",
            value: "72",
            change: "+3",
            trend: "up",
            icon: TrendingUp,
          },
        ]

        setStats(statsData)

        const orders = await getWorkOrders(MOCK_COMPANY_ID)
        setRecentWorkOrders(orders.slice(0, 5))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setStats([
          {
            title: "Total de Clientes",
            value: "0",
            change: "+0%",
            trend: "up",
            icon: Users,
          },
          {
            title: "OS este mês",
            value: "0",
            change: "+0%",
            trend: "up",
            icon: ClipboardList,
          },
          {
            title: "Faturamento",
            value: "R$ 0",
            change: "+0%",
            trend: "up",
            icon: DollarSign,
          },
          {
            title: "NPS",
            value: "0",
            change: "+0",
            trend: "up",
            icon: TrendingUp,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const upcomingServices = [
    {
      id: 1,
      client: "Restaurante Sabor Caseiro",
      service: "Desinsetização",
      technician: "João Silva",
      time: "14:00",
    },
    {
      id: 2,
      client: "Hotel Paradiso",
      service: "Dedetização",
      technician: "Maria Santos",
      time: "16:30",
    },
    {
      id: 3,
      client: "Esc municipal Educação",
      service: "Desinsetização",
      technician: "João Silva",
      time: "09:00",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das operações</p>
        </div>
        <div className="flex gap-2">
          <Link href="/work-orders/new">
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
              + Nova OS
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Ordens de Serviço</CardTitle>
            <Link href="/work-orders" className="text-sm text-primary hover:underline flex items-center">
              Ver todas <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma ordem de serviço encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWorkOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.client?.name || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{order.service_type?.name || "Serviço"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.scheduled_date} às {order.scheduled_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Agenda de Hoje</CardTitle>
            <Link href="/schedule" className="text-sm text-primary hover:underline flex items-center">
              Ver agenda <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingServices.map((service) => (
                <div key={service.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">{service.client}</p>
                    <p className="text-xs text-muted-foreground">{service.service}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {service.technician}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{service.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/clients/new">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Novo Cliente</p>
                <p className="text-xs text-muted-foreground">Cadastrar cliente</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/work-orders/new">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Nova OS</p>
                <p className="text-xs text-muted-foreground">Criar ordem de serviço</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/schedule">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Agendar</p>
                <p className="text-xs text-muted-foreground">Agendar serviço</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Laudos</p>
                <p className="text-xs text-muted-foreground">Ver relatórios</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}