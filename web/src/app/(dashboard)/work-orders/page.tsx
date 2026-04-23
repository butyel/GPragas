"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ClipboardList,
  Search,
  Plus,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  Truck,
  PlayCircle,
  AlertCircle,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  X,
  ChevronRight,
  MapPinned,
} from "lucide-react"
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { getWorkOrders, getWorkOrderById } from "@/lib/data"

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [technician, setTechnician] = useState("")
  const [sortBy, setSortBy] = useState("scheduled_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const router = useRouter()

  const MOCK_COMPANY_ID = "demo-company"

  useEffect(() => {
    async function loadWorkOrders() {
      try {
        const data = await getWorkOrders(MOCK_COMPANY_ID, {
          status: status || undefined,
          technicianId: technician || undefined,
        })
        setWorkOrders(data || [])
      } catch (error) {
        console.error("Erro ao carregar ordens de serviço:", error)
        setWorkOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadWorkOrders()
  }, [search, status, technician])

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.client?.document?.includes(search)
    const matchesDateFrom = !dateFrom || order.scheduled_date >= dateFrom
    const matchesDateTo = !dateTo || order.scheduled_date <= dateTo
    return matchesSearch && matchesDateFrom && matchesDateTo
  }).sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    if (sortBy === "scheduled_date") {
      aVal = `${a.scheduled_date}T${a.scheduled_time || "00:00"}`
      bVal = `${b.scheduled_date}T${b.scheduled_time || "00:00"}`
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setTechnician("")
    setDateFrom("")
    setDateTo("")
    setSortBy("scheduled_date")
    setSortOrder("desc")
  }

  const hasFilters = search || status || technician || dateFrom || dateTo

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      await supabase.from("work_orders").update({ status: newStatus }).eq("id", orderId)
      setWorkOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getNextStatus = (currentStatus: string) => {
    const flow: Record<string, string> = {
      scheduled: "in_transit",
      in_transit: "in_progress",
      in_progress: "completed",
    }
    return flow[currentStatus]
  }

  const getNextStatusLabel = (currentStatus: string) => {
    const labels: Record<string, string> = {
      scheduled: "Iniciar Deslocamento",
      in_transit: "Iniciar Serviço",
      in_progress: "Concluir Serviço",
    }
    return labels[currentStatus]
  }

  const statusCounts = {
    scheduled: workOrders.filter((o) => o.status === "scheduled").length,
    in_transit: workOrders.filter((o) => o.status === "in_transit").length,
    in_progress: workOrders.filter((o) => o.status === "in_progress").length,
    completed: workOrders.filter((o) => o.status === "completed").length,
    pending_report: workOrders.filter((o) => o.status === "pending_report").length,
    cancelled: workOrders.filter((o) => o.status === "cancelled").length,
  }

  const handleViewOrder = async (order: any) => {
    try {
      const fullOrder = await getWorkOrderById(order.id)
      setSelectedOrder(fullOrder)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Erro ao carregar ordem de serviço:", error)
      setSelectedOrder(order)
      setIsModalOpen(true)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "in_progress":
        return <PlayCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "pending_report":
        return <FileText className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando ordens de serviço...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as OSs e acompanhe o status dos serviços</p>
        </div>
        <Link href="/work-orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova OS
          </Button>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Agendadas</p>
              <p className="text-2xl font-bold">{statusCounts.scheduled}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em deslocamento</p>
              <p className="text-2xl font-bold">{statusCounts.in_transit}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Truck className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em execução</p>
              <p className="text-2xl font-bold">{statusCounts.in_progress}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-bold">{statusCounts.completed}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aguardando laudo</p>
              <p className="text-2xl font-bold">{statusCounts.pending_report}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Canceladas</p>
              <p className="text-2xl font-bold">{statusCounts.cancelled}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por OS ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full md:w-36"
              placeholder="De"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full md:w-36"
              placeholder="Até"
            />
            <Select
              options={[
                { value: "", label: "Todos os status" },
                { value: "scheduled", label: "Agendada" },
                { value: "in_transit", label: "Em deslocamento" },
                { value: "in_progress", label: "Em execução" },
                { value: "completed", label: "Concluída" },
                { value: "pending_report", label: "Aguardando laudo" },
                { value: "cancelled", label: "Cancelada" },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-40"
            />
            <Select
              options={[
                { value: "", label: "Todos os técnicos" },
              ]}
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full md:w-48"
              placeholder="Filtrar por técnico"
            />
            <Select
              options={[
                { value: "scheduled_date", label: "Data" },
                { value: "id", label: "OS" },
                { value: "value", label: "Valor" },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-32"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Crescente" : "Decrescente"}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
            </Button>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work Orders List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhuma ordem de serviço encontrada</p>
              <Link href="/work-orders/new">
                <Button variant="link" className="mt-2">
                  Criar primeira OS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">OS</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Serviço</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Técnico</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Data/Hora</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Valor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-medium">{order.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.client?.name || 'Cliente não encontrado'}</p>
                          <p className="text-xs text-muted-foreground">{order.client?.document || ''}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{order.service_type?.name || 'Serviço não especificado'}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.target_pests?.join(", ") || ''}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {order.technician?.user?.full_name || 'Técnico não atribuído'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{formatDate(order.scheduled_date)}</p>
                          <p className="text-muted-foreground">{formatTime(order.scheduled_time)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatCurrency(order.value || 0)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)} title="Ver detalhes">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== "completed" && order.status !== "cancelled" && getNextStatus(order.status) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(order.id, getNextStatus(order.status))}
                              disabled={updatingStatus === order.id}
                              title={getNextStatusLabel(order.status)}
                              className="text-primary"
                            >
                              {updatingStatus === order.id ? (
                                <Clock className="h-4 w-4 animate-spin" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {(order.status === "scheduled" || order.status === "in_transit" || order.status === "in_progress") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/work-orders/execute/${order.id}`)}
                              title="Executar OS"
                              className="text-green-600"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === "completed" && (
                            <Button variant="ghost" size="icon" title="Gerar Laudo">
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === "in_progress" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(order.id, "cancelled")}
                              disabled={updatingStatus === order.id}
                              title="Cancelar OS"
                              className="text-red-500"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da OS {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Informações completas da ordem de serviço
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Serviço</label>
                  <p className="font-medium">{selectedOrder.service_type?.name || 'Serviço não especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{selectedOrder.client?.name || 'Cliente não encontrado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ/CPF</label>
                  <p className="font-mono">{selectedOrder.client?.document || ''}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Técnico</label>
                  <p className="font-medium">{selectedOrder.technician?.user?.full_name || 'Técnico não atribuído'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data/Hora</label>
                  <p className="font-medium">
                    {formatDate(selectedOrder.scheduled_date)} às {formatTime(selectedOrder.scheduled_time)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="font-medium">{selectedOrder.address || ''}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.city || ''}/{selectedOrder.state || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pragas-alvo</label>
                  <div className="flex gap-1 mt-1">
                    {selectedOrder.target_pests?.map((pest: string) => (
                      <Badge key={pest} variant="outline">{pest}</Badge>
                    )) || []}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="text-xl font-bold">{formatCurrency(selectedOrder.value || 0)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            {selectedOrder?.status === "completed" && (
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Laudo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}