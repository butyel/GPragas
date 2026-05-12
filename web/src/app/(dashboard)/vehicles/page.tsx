"use client"

import { useState, useEffect } from "react"
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
  Truck,
  Search,
  Plus,
  Fuel,
  Calendar,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getVehicles } from "@/lib/data"

const MOCK_COMPANY_ID = "11111111-1111-1111-1111-111111111111"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    license_plate: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    status: "active",
    current_km: 0,
    fuel_type: "gasolina",
  })

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getVehicles(MOCK_COMPANY_ID)
        setVehicles(data || [])
      } catch (error) {
        console.error("Erro ao carregar veículos:", error)
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const filteredVehicles = vehicles.filter((v) => {
    return (
      v.license_plate?.toLowerCase().includes(search.toLowerCase()) ||
      v.model?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const statusCounts = {
    active: vehicles.filter((v) => v.status === "active").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    inactive: vehicles.filter((v) => v.status === "inactive").length,
  }

  const totalKm = vehicles.reduce((acc, v) => acc + (v.current_km || 0), 0)

  const handleCreateVehicle = () => {
    setFormData({
      license_plate: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      status: "active",
      current_km: 0,
      fuel_type: "gasolina",
    })
    setIsEditing(false)
    setIsCreateModalOpen(true)
  }

  const handleEditVehicle = () => {
    if (selectedVehicle) {
      setFormData({
        license_plate: selectedVehicle.license_plate || "",
        model: selectedVehicle.model || "",
        year: selectedVehicle.year || new Date().getFullYear(),
        color: selectedVehicle.color || "",
        status: selectedVehicle.status || "active",
        current_km: selectedVehicle.current_km || 0,
        fuel_type: selectedVehicle.fuel_type || "gasolina",
      })
      setIsEditing(true)
      setIsCreateModalOpen(true)
    }
  }

  const handleSaveVehicle = async () => {
    try {
      const newVehicle = {
        ...formData,
        id: isEditing ? selectedVehicle?.id : `VEH-${Date.now()}`,
        company_id: MOCK_COMPANY_ID,
        assigned_technician: isEditing ? selectedVehicle?.assigned_technician : null,
        last_maintenance: isEditing ? selectedVehicle?.last_maintenance : null,
        next_maintenance: isEditing ? selectedVehicle?.next_maintenance : null,
      }
      
      if (isEditing) {
        setVehicles(prev => prev.map(v => v.id === selectedVehicle?.id ? { ...v, ...newVehicle } : v))
      } else {
        setVehicles(prev => [...prev, newVehicle])
      }
      
      setIsCreateModalOpen(false)
      alert(isEditing ? "Veículo atualizado com sucesso!" : "Veículo criado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar veículo:", error)
      alert("Erro ao salvar veículo")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">Gerencie a frota de veículos</p>
        </div>
        <Button onClick={handleCreateVehicle}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold">{statusCounts.active}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Manutenção</p>
              <p className="text-2xl font-bold">{statusCounts.maintenance}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inativos</p>
              <p className="text-2xl font-bold">{statusCounts.inactive}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Km Total</p>
              <p className="text-2xl font-bold">{totalKm.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa ou modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum veículo encontrado</p>
              <Button variant="link" className="mt-2">
                Cadastrar primeiro veículo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Veículo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Placa</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ano</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Técnico</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Km Atual</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Última Manutenção</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Próxima Manutenção</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.model}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.color || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-medium">{vehicle.license_plate}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{vehicle.year}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{vehicle.assigned_technician?.name || "—"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Gauge className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{(vehicle.current_km || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(vehicle.last_maintenance)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(vehicle.next_maintenance)}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={vehicle.status === "active" ? "bg-green-100 text-green-800" : vehicle.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                          {vehicle.status === "active" ? "Ativo" : vehicle.status === "maintenance" ? "Manutenção" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewVehicle(vehicle)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Veículo</DialogTitle>
            <DialogDescription>
              Informações do veículo
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                  <p className="font-medium">{selectedVehicle.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Placa</label>
                  <p className="font-mono">{selectedVehicle.plate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ano</label>
                  <p>{selectedVehicle.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cor</label>
                  <p>{selectedVehicle.color}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Km Atual</label>
                  <p className="font-medium">{selectedVehicle.current_km.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={selectedVehicle.status === "active" ? "bg-green-100 text-green-800" : selectedVehicle.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                      {selectedVehicle.status === "active" ? "Ativo" : selectedVehicle.status === "maintenance" ? "Manutenção" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Técnico</label>
                  <p>{selectedVehicle.assigned_technician || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Combustível</label>
                  <p className="capitalize">{selectedVehicle.fuel_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Manutenção</label>
                  <p>{formatDate(selectedVehicle.last_maintenance)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Próxima Manutenção</label>
                  <p>{formatDate(selectedVehicle.next_maintenance)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleEditVehicle}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edite as informações do veículo" : "Preencha as informações do novo veículo"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Placa *</label>
              <Input
                value={formData.license_plate}
                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                placeholder="ABC-1234"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Modelo *</label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ford Ranger"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Ano</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cor</label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Branca"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1"
                options={[
                  { value: "active", label: "Ativo" },
                  { value: "maintenance", label: "Em Manutenção" },
                  { value: "inactive", label: "Inativo" },
                ]}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Km Atual</label>
              <Input
                type="number"
                value={formData.current_km}
                onChange={(e) => setFormData({ ...formData, current_km: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Combustível</label>
              <Select
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                className="mt-1"
                options={[
                  { value: "gasolina", label: "Gasolina" },
                  { value: "diesel", label: "Diesel" },
                  { value: "flex", label: "Flex" },
                  { value: "eletrico", label: "Elétrico" },
                ]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVehicle} disabled={!formData.license_plate || !formData.model}>
              <Plus className="mr-2 h-4 w-4" />
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}