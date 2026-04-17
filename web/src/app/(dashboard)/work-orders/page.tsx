"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"

const mockWorkOrders = [
  {
    id: "OS-001",
    client: "Restaurante Sabor Caseiro",
    client_document: "12.345.678/0001-90",
    service: "Desinsetização",
    target_pests: ["baratas", "formigas"],
    technician: "João Silva",
    status: "scheduled",
    scheduled_date: "2026-04-16",
    scheduled_time: "14:00",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    value: 150.00,
  },
  {
    id: "OS-002",
    client: "Empresa ABC Ltda",
    client_document: "98.765.432/0001-10",
    service: "Desratização",
    target_pests: ["ratos"],
    technician: "Maria Santos",
    status: "in_progress",
    scheduled_date: "2026-04-16",
    scheduled_time: "09:00",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    value: 180.00,
  },
  {
    id: "OS-003",
    client: "Casa da Família Silva",
    client_document: "123.456.789-00",
    service: "Dedetização Completa",
    target_pests: ["baratas", "mosquitos", "formigas"],
    technician: "João Silva",
    status: "completed",
    scheduled_date: "2026-04-15",
    scheduled_time: "10:00",
    address: "Rua dos Pinheiros, 456",
    city: "São Paulo",
    state: "SP",
    value: 250.00,
  },
  {
    id: "OS-004",
    client: "Supermercado Bom Preço",
    client_document: "55.444.333/0001-22",
    service: "MIP - Manejo Integrado",
    target_pests: ["baratas", "roedores"],
    technician: "Carlos Oliveira",
    status: "pending_report",
    scheduled_date: "2026-04-15",
    scheduled_time: "15:30",
    address: "Av. Brasil, 500",
    city: "São Paulo",
    state: "SP",
    value: 450.00,
  },
  {
    id: "OS-005",
    client: "Clínica Saúde",
    client_document: "11.222.333/0001-44",
    service: "Sanitização Hospitalar",
    target_pests: ["bactérias", "vírus"],
    technician: "Maria Santos",
    status: "scheduled",
    scheduled_date: "2026-04-17",
    scheduled_time: "08:00",
    address: "Rua das Clínicas, 200",
    city: "São Paulo",
    state: "SP",
    value: 350.00,
  },
  {
    id: "OS-006",
    client: "Hotel Paradiso",
    client_document: "22.333.444/0001-55",
    service: "Dedetização",
    target_pests: ["baratas", "mosquitos"],
    technician: "João Silva",
    status: "cancelled",
    scheduled_date: "2026-04-14",
    scheduled_time: "11:00",
    address: "Av. Hotels, 100",
    city: "São Paulo",
    state: "SP",
    value: 200.00,
  },
]

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "scheduled", label: "Agendada" },
  { value: "in_transit", label: "Em deslocamento" },
  { value: "in_progress", label: "Em execução" },
  { value: "completed", label: "Concluída" },
  { value: "pending_report", label: "Aguardando laudo" },
  { value: "cancelled", label: "Cancelada" },
]

const technicianOptions = [
  { value: "", label: "Todos os técnicos" },
  { value: "1", label: "João Silva" },
  { value: "2", label: "Maria Santos" },
  { value: "3", label: "Carlos Oliveira" },
]

export default function WorkOrdersPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [technician, setTechnician] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof mockWorkOrders[0] | null>(null)

  const filteredOrders = mockWorkOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.client.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !status || order.status === status
    const matchesTechnician = !technician || order.technician.includes(technician)
    return matchesSearch && matchesStatus && matchesTechnician
  })

  const statusCounts = {
    scheduled: mockWorkOrders.filter((o) => o.status === "scheduled").length,
    in_transit: mockWorkOrders.filter((o) => o.status === "in_transit").length,
    in_progress: mockWorkOrders.filter((o) => o.status === "in_progress").length,
    completed: mockWorkOrders.filter((o) => o.status === "completed").length,
    pending_report: mockWorkOrders.filter((o) => o.status === "pending_report").length,
  }

  const handleViewOrder = (order: typeof mockWorkOrders[0]) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
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
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-40"
            />
            <Select
              options={technicianOptions}
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full md:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Orders List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
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
                        <p className="font-medium">{order.client}</p>
                        <p className="text-xs text-muted-foreground">{order.address}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{order.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.target_pests.join(", ")}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {order.technician}
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
                      <span className="font-medium">{formatCurrency(order.value)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {order.status === "completed" && (
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <p className="font-medium">{selectedOrder.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{selectedOrder.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ/CPF</label>
                  <p className="font-mono">{selectedOrder.client_document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Técnico</label>
                  <p className="font-medium">{selectedOrder.technician}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data/Hora</label>
                  <p className="font-medium">{formatDate(selectedOrder.scheduled_date)} às {formatTime(selectedOrder.scheduled_time)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="font-medium">{selectedOrder.address}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.city}/{selectedOrder.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pragas-alvo</label>
                  <div className="flex gap-1 mt-1">
                    {selectedOrder.target_pests.map((pest) => (
                      <Badge key={pest} variant="outline">{pest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="text-xl font-bold">{formatCurrency(selectedOrder.value)}</span>
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