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
  Megaphone,
  Search,
  Plus,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Eye,
  Edit,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getQuotes } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    client_name: "",
    client_document: "",
    service_type_name: "",
    value: 0,
    valid_until: "",
    status: "pending",
  })

  useEffect(() => {
    async function loadQuotes() {
      try {
        const data = await getQuotes(MOCK_COMPANY_ID)
        setQuotes(data || [])
      } catch (error) {
        console.error("Erro ao carregar orçamentos:", error)
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }
    loadQuotes()
  }, [])

  const filteredQuotes = quotes.filter((quote) => {
    return (
      quote.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      quote.id?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote)
    setIsModalOpen(true)
  }

  const statusCounts = {
    pending: quotes.filter((q) => q.status === "pending").length,
    sent: quotes.filter((q) => q.status === "sent").length,
    approved: quotes.filter((q) => q.status === "approved").length,
    expired: quotes.filter((q) => q.status === "expired").length,
  }

  const handleCreateQuote = () => {
    setFormData({
      client_name: "",
      client_document: "",
      service_type_name: "",
      value: 0,
      valid_until: "",
      status: "pending",
    })
    setIsEditing(false)
    setIsCreateModalOpen(true)
  }

  const handleEditQuote = () => {
    if (selectedQuote) {
      setFormData({
        client_name: selectedQuote.client?.name || "",
        client_document: selectedQuote.client?.document || "",
        service_type_name: selectedQuote.service_type?.name || "",
        value: selectedQuote.value || 0,
        valid_until: selectedQuote.valid_until || "",
        status: selectedQuote.status || "pending",
      })
      setIsEditing(true)
      setIsCreateModalOpen(true)
    }
  }

  const handleSaveQuote = async () => {
    try {
      const newQuote = {
        ...formData,
        id: isEditing ? selectedQuote?.id : `ORC-${Date.now()}`,
        company_id: MOCK_COMPANY_ID,
        client: { name: formData.client_name, document: formData.client_document },
        created_at: isEditing ? selectedQuote?.created_at : new Date().toISOString().split("T")[0],
      }
      
      if (isEditing) {
        setQuotes(prev => prev.map(q => q.id === selectedQuote?.id ? { ...q, ...newQuote } : q))
      } else {
        setQuotes(prev => [...prev, newQuote])
      }
      
      setIsCreateModalOpen(false)
      alert(isEditing ? "Orçamento atualizado com sucesso!" : "Orçamento criado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error)
      alert("Erro ao salvar orçamento")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e propostas</p>
        </div>
        <Button onClick={handleCreateQuote}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-clo-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold">{statusCounts.pending}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold">{statusCounts.sent}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold">{statusCounts.approved}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expirados</p>
              <p className="text-2xl font-bold">{statusCounts.expired}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou número..."
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
          ) : filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum orçamento encontrado</p>
              <Button variant="link" className="mt-2">
                Criar primeiro orçamento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Orçamento</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Serviço</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Valor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Criado em</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Validade</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-medium">{quote.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{quote.client?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {quote.client?.document || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{quote.service_type?.name || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatCurrency(quote.value || 0)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(quote.created_at)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(quote.valid_until)}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={quote.status === "approved" ? "bg-green-100 text-green-800" : quote.status === "sent" ? "bg-blue-100 text-blue-800" : quote.status === "expired" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                          {quote.status === "pending" ? "Pendente" : quote.status === "sent" ? "Enviado" : quote.status === "approved" ? "Aprovado" : "Expirado"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewQuote(quote)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
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
            <DialogTitle>Detalhes do Orçamento</DialogTitle>
            <DialogDescription>
              {selectedQuote?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{selectedQuote.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="font-mono">{selectedQuote.client_document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Serviço</label>
                  <p>{selectedQuote.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="font-medium">{formatCurrency(selectedQuote.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                  <p>{formatDate(selectedQuote.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Validade</label>
                  <p>{formatDate(selectedQuote.valid_until)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={selectedQuote.status === "approved" ? "bg-green-100 text-green-800" : selectedQuote.status === "sent" ? "bg-blue-100 text-blue-800" : selectedQuote.status === "expired" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                      {selectedQuote.status === "pending" ? "Pendente" : selectedQuote.status === "sent" ? "Enviado" : selectedQuote.status === "approved" ? "Aprovado" : "Expirado"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleEditQuote}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Orçamento" : "Novo Orçamento"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edite as informações do orçamento" : "Preencha as informações do novo orçamento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Cliente *</label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Nome do cliente"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CNPJ/CPF</label>
              <Input
                value={formData.client_document}
                onChange={(e) => setFormData({ ...formData, client_document: e.target.value })}
                placeholder="CNPJ ou CPF"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Serviço</label>
              <Input
                value={formData.service_type_name}
                onChange={(e) => setFormData({ ...formData, service_type_name: e.target.value })}
                placeholder="Tipo de serviço"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valor</label>
              <Input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Validade</label>
              <Input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
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
                  { value: "pending", label: "Pendente" },
                  { value: "sent", label: "Enviado" },
                  { value: "approved", label: "Aprovado" },
                  { value: "expired", label: "Expirado" },
                ]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuote} disabled={!formData.client_name}>
              <Plus className="mr-2 h-4 w-4" />
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}