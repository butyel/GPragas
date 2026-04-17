"use client"

import { useState, useEffect } from "react"
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
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  Home,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { getClients, getClientById } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const MOCK_COMPANY_ID = "demo-company"

const segmentOptions = [
  { value: "", label: "Todos os segmentos" },
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "food_service", label: "Food Service" },
  { value: "hospital", label: "Hospitalar" },
]

const getSegmentLabel = (segment: string) => {
  const labels: Record<string, string> = {
    residential: "Residencial",
    commercial: "Comercial",
    industrial: "Industrial",
    food_service: "Food Service",
    hospital: "Hospitalar",
  }
  return labels[segment] || segment || "—"
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800"
  if (score >= 60) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients(MOCK_COMPANY_ID)
        setClients(data || [])
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(search.toLowerCase()) ||
      client.document?.includes(search) ||
      client.email?.toLowerCase().includes(search.toLowerCase())
    const matchesSegment = !segment || client.segment === segment
    return matchesSearch && matchesSegment
  })

  const handleViewClient = async (client: any) => {
    try {
      const fullClient = await getClientById(client.id)
      setSelectedClient(fullClient)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      setSelectedClient(client)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e leads</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, documento ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={segmentOptions}
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full md:w-48"
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
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum cliente encontrado</p>
              <Link href="/clients/new">
                <Button variant="link" className="mt-2">
                  Cadastrar primeiro cliente
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Segmento</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Contato</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Localização</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Score</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                            {client.type === "pj" ? (
                              <Building2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Home className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{client.document}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{getSegmentLabel(client.segment)}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {client.phone}
                          </div>
                          {client.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                          {client.city}/{client.state}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(client.score || 0)}`}>
                          {client.score || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)}>
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
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Documento</label>
                  <p className="font-mono">{selectedClient.document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p>{selectedClient.type === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Segmento</label>
                  <p>{getSegmentLabel(selectedClient.segment)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p>{selectedClient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cidade/UF</label>
                  <p>{selectedClient.city}/{selectedClient.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Score</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(selectedClient.score || 0)}`}>
                    {selectedClient.score || 0}
                  </span>
                </div>
              </div>
              {selectedClient.tags && selectedClient.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClient.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
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