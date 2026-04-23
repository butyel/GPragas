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
  DollarSign,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getInvoices } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

const typeOptions = [
  { value: "", label: "Todos os tipos" },
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
]

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "received", label: "Recebido" },
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
]

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)

  useEffect(() => {
    async function loadInvoices() {
      try {
        const data = await getInvoices(MOCK_COMPANY_ID)
        setTransactions(data || [])
      } catch (error) {
        console.error("Erro ao carregar faturas:", error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    loadInvoices()
  }, [])

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.client?.name?.toLowerCase().includes(search.toLowerCase())
    const matchesType = !type || t.type === type
    const matchesStatus = !status || t.status === status
    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status !== "pending")
    .reduce((acc, t) => acc + (t.value || 0), 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + (t.value || 0), 0)
  const pendingReceivables = transactions
    .filter((t) => t.type === "income" && t.status === "pending")
    .reduce((acc, t) => acc + (t.value || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Controle financeiro e fluxo de caixa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receitas Recebidas</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Despesas Pagas</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome - totalExpense)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">A Receber</p>
              <p className="text-2xl font-bold">{formatCurrency(pendingReceivables)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full md:w-32"
            />
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-32"
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
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhuma transação encontrada</p>
              <Button variant="link" className="mt-2">
                Registrar primeira transação
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Tipo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Descrição</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente/Fornecedor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Data</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Valor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <Badge className={transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {transaction.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{transaction.description || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{transaction.client?.name || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(transaction.due_date)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.value || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={transaction.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {transaction.status === "paid" ? "Pago" : "Pendente"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
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
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>
              Informações da transação
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <div className="mt-1">
                    <Badge className={selectedTransaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {selectedTransaction.type === "income" ? "Receita" : "Despesa"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={selectedTransaction.status === "received" || selectedTransaction.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {selectedTransaction.status === "received" ? "Recebido" : selectedTransaction.status === "pending" ? "Pendente" : "Pago"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="font-medium">{selectedTransaction.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente/Fornecedor</label>
                  <p>{selectedTransaction.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="font-medium">{formatCurrency(selectedTransaction.value)}</p>
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