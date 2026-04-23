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
  FileClock,
  Search,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getContracts } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

const getFrequencyLabel = (frequency: string) => {
  const labels: Record<string, string> = {
    semanal: "Semanal",
    quinzenal: "Quinzenal",
    mensal: "Mensal",
    bimestral: "Bimestral",
    trimestral: "Trimestral",
    semestral: "Semestral",
    anual: "Anual",
  }
  return labels[frequency] || frequency
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any | null>(null)

  useEffect(() => {
    async function loadContracts() {
      try {
        const data = await getContracts(MOCK_COMPANY_ID)
        setContracts(data || [])
      } catch (error) {
        console.error("Erro ao carregar contratos:", error)
        setContracts([])
      } finally {
        setLoading(false)
      }
    }
    loadContracts()
  }, [])

  const filteredContracts = contracts.filter((contract) => {
    return (
      contract.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      contract.id?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract)
    setIsModalOpen(true)
  }

  const statusCounts = {
    active: contracts.filter((c) => c.status === "active").length,
    expiring: contracts.filter((c) => c.status === "expiring").length,
    expired: contracts.filter((c) => c.status === "expired").length,
  }

  const monthlyRevenue = contracts
    .filter((c) => c.status !== "expired")
    .reduce((acc, c) => acc + (c.value || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contratos</h1>
          <p className="text-muted-foreground">Gerencie contratos de serviços</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
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
              <p className="text-sm text-muted-foreground">Expirando</p>
              <p className="text-2xl font-bold">{statusCounts.expiring}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
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
              <FileClock className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou número do contrato..."
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
          ) : filteredContracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileClock className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum contrato encontrado</p>
              <Button variant="link" className="mt-2">
                Criar primeiro contrato
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Contrato</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Serviço</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Frequência</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Valor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Início</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Fim</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-medium">{contract.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{contract.client?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {contract.client?.document || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{contract.service_type?.name || "—"}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {getFrequencyLabel(contract.frequency)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {formatCurrency(contract.value || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(contract.start_date)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(contract.end_date)}</span>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            contract.status === "active"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "expiring"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {contract.status === "active"
                            ? "Ativo"
                            : contract.status === "expiring"
                            ? "Expirando"
                            : "Expirado"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewContract(contract)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <RefreshCw className="h-4 w-4" />
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
            <DialogTitle>Detalhes do Contrato</DialogTitle>
            <DialogDescription>
              {selectedContract?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{selectedContract.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="font-mono">{selectedContract.client_document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Serviço</label>
                  <p>{selectedContract.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Frequência</label>
                  <p>{getFrequencyLabel(selectedContract.frequency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="font-medium">{formatCurrency(selectedContract.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                  <p>{formatDate(selectedContract.start_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Término</label>
                  <p>{formatDate(selectedContract.end_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge
                      className={
                        selectedContract.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedContract.status === "expiring"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedContract.status === "active"
                        ? "Ativo"
                        : selectedContract.status === "expiring"
                        ? "Expirando"
                        : "Expirado"}
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