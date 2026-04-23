"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  User,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Truck,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { getTechnicians } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<any | null>(null)

  useEffect(() => {
    async function loadTechnicians() {
      try {
        const data = await getTechnicians(MOCK_COMPANY_ID)
        setTechnicians(data || [])
      } catch (error) {
        console.error("Erro ao carregar técnicos:", error)
        setTechnicians([])
      } finally {
        setLoading(false)
      }
    }
    loadTechnicians()
  }, [])

  const filteredTechnicians = technicians.filter((tech) => {
    return (
      tech.name?.toLowerCase().includes(search.toLowerCase()) ||
      tech.document?.includes(search) ||
      tech.email?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleViewTechnician = (tech: any) => {
    setSelectedTechnician(tech)
    setIsModalOpen(true)
  }

  const statusCounts = {
    active: technicians.filter((t) => t.status === "active").length,
    inactive: technicians.filter((t) => t.status === "inactive").length,
  }

  const avgRating = technicians.length > 0 
    ? (technicians.reduce((acc, t) => acc + (t.rating || 0), 0) / technicians.length).toFixed(1)
    : "0.0"
  
  const totalServices = technicians.reduce((acc, t) => acc + (t.services_total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie a equipe de técnicos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Técnico
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
              <p className="text-sm text-muted-foreground">Inativos</p>
              <p className="text-2xl font-bold">{statusCounts.inactive}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nota Média</p>
              <p className="text-2xl font-bold">{avgRating}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Serviços Total</p>
              <p className="text-2xl font-bold">{totalServices}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, documento ou email..."
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
          ) : filteredTechnicians.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum técnico encontrado</p>
              <Button variant="link" className="mt-2">
                Cadastrar primeiro técnico
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Técnico</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Contato</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Localização</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Veículo</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Nota</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Serviços</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechnicians.map((tech) => (
                  <tr key={tech.id} className="border-b hover:bg-surface-elevated transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{tech.document}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                          {tech.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          {tech.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                        {tech.city}/{tech.state}
                      </div>
                    </td>
                    <td className="p-4">
                      {tech.vehicle ? (
                        <div className="flex items-center text-sm">
                          <Truck className="h-3 w-3 mr-2 text-muted-foreground" />
                          {tech.vehicle}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{tech.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{tech.services_total}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={tech.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {tech.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTechnician(tech)}>
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
            <DialogTitle>Detalhes do Técnico</DialogTitle>
            <DialogDescription>
              Informações completas do técnico
            </DialogDescription>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="font-medium">{selectedTechnician.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <p className="font-mono">{selectedTechnician.document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p>{selectedTechnician.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedTechnician.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cidade/UF</label>
                  <p>{selectedTechnician.city}/{selectedTechnician.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Veículo</label>
                  <p>{selectedTechnician.vehicle || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={selectedTechnician.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {selectedTechnician.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nota</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{selectedTechnician.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}