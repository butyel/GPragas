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
  FileText,
  Search,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  QrCode,
  Share2,
  Loader2,
} from "lucide-react"
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils"
import { getReports } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

const getReportTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    dedetization: "Laudo de Dedetização",
    mip: "Laudo MIP",
    certification: "Certificado",
    sanitary: "Laudo Sanitário",
  }
  return labels[type] || type
}

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getReports(MOCK_COMPANY_ID)
        setReports(data || [])
      } catch (error) {
        console.error("Erro ao carregar laudos:", error)
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id?.toLowerCase().includes(search.toLowerCase()) ||
      report.client?.name?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const statusCounts = {
    draft: reports.filter((r) => r.status === "draft").length,
    pending_approval: reports.filter((r) => r.status === "pending_approval").length,
    approved: reports.filter((r) => r.status === "approved").length,
    sent: reports.filter((r) => r.status === "sent").length,
    expired: reports.filter((r) => r.status === "expired").length,
  }

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laudos Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os laudos e certificados emitidos</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Novo Laudo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rascunhos</p>
              <p className="text-2xl font-bold">{statusCounts.draft}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
              <p className="text-2xl font-bold">{statusCounts.pending_approval}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
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
              <p className="text-sm text-muted-foreground">Expirados</p>
              <p className="text-2xl font-bold">{statusCounts.expired}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número do laudo ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum laudo encontrado</p>
              <Button variant="link" className="mt-2">
                Gerar primeiro laudo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Laudo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">OS</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Tipo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Data</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Validade</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-medium">{report.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm">{report.work_order_id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{report.client?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{report.service_type?.name || "—"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{getReportTypeLabel(report.report_type)}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(report.created_at)}</span>
                      </td>
                      <td className="p-4">
                        {report.valid_until ? (
                          <span className="text-sm">{formatDate(report.valid_until)}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusLabel(report.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === "approved" && (
                            <>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </>
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

      {/* Report Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Laudo</DialogTitle>
            <DialogDescription>
              {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{selectedReport.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Serviço</label>
                  <p className="font-medium">{selectedReport.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ordem de Serviço</label>
                  <p className="font-mono">{selectedReport.work_order_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="font-medium">{getReportTypeLabel(selectedReport.report_type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Emissão</label>
                  <p className="font-medium">{formatDate(selectedReport.issue_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Validade</label>
                  <p className="font-medium">
                    {selectedReport.valid_until ? formatDate(selectedReport.valid_until) : "Não definida"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedReport.status)}>
                      {getStatusLabel(selectedReport.status)}
                    </Badge>
                  </div>
                </div>
                {selectedReport.qr_code && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">QR Code</label>
                    <div className="mt-1 flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      <span className="font-mono text-sm">{selectedReport.qr_code}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedReport.status === "draft" && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Ações disponíveis:</p>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  </div>
                </div>
              )}

              {selectedReport.status === "approved" && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Ações disponíveis:</p>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar ao Cliente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}