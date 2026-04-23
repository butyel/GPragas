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
  MessageSquare,
  Search,
  Plus,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Megaphone,
  Loader2,
} from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { getCommunications } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    type: "whatsapp",
    title: "",
    client_name: "",
    message: "",
  })

  useEffect(() => {
    async function loadCommunications() {
      try {
        const data = await getCommunications(MOCK_COMPANY_ID)
        setMessages(data || [])
      } catch (error) {
        console.error("Erro ao carregar comunicações:", error)
        setMessages([])
      } finally {
        setLoading(false)
      }
    }
    loadCommunications()
  }, [])

  const filteredMessages = messages.filter((msg) => {
    return (
      msg.title?.toLowerCase().includes(search.toLowerCase()) ||
      msg.client?.name?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleViewMessage = (msg: any) => {
    setSelectedMessage(msg)
    setIsModalOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "sms":
        return <MessageSquare className="h-4 w-4 text-orange-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "opened":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "replied":
        return <MessageCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const whatsappCount = messages.filter((m) => m.type === "whatsapp").length
  const emailCount = messages.filter((m) => m.type === "email").length
  const smsCount = messages.filter((m) => m.type === "sms").length
  const openRate = messages.length > 0
    ? Math.round((messages.filter((m) => m.status === "opened" || m.status === "replied").length / messages.length) * 100)
    : 0

  const handleCreateMessage = () => {
    setFormData({
      type: "whatsapp",
      title: "",
      client_name: "",
      message: "",
    })
    setIsEditing(false)
    setIsCreateModalOpen(true)
  }

  const handleEditMessage = () => {
    if (selectedMessage) {
      setFormData({
        type: selectedMessage.type || "whatsapp",
        title: selectedMessage.title || "",
        client_name: selectedMessage.client?.name || "",
        message: selectedMessage.message || "",
      })
      setIsEditing(true)
      setIsCreateModalOpen(true)
    }
  }

  const handleSaveMessage = async () => {
    try {
      const now = new Date().toISOString()
      const newMessage = {
        ...formData,
        id: isEditing ? selectedMessage?.id : `MSG-${Date.now()}`,
        company_id: MOCK_COMPANY_ID,
        client: { name: formData.client_name },
        sent_at: isEditing ? selectedMessage?.sent_at : now,
        status: "delivered",
      }
      
      if (isEditing) {
        setMessages(prev => prev.map(m => m.id === selectedMessage?.id ? { ...m, ...newMessage } : m))
      } else {
        setMessages(prev => [...prev, newMessage])
      }
      
      setIsCreateModalOpen(false)
      alert(isEditing ? "Mensagem atualizada com sucesso!" : "Mensagem enviada com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error)
      alert("Erro ao salvar mensagem")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comunicações</h1>
          <p className="text-muted-foreground">Gerencie notificações e mensagens</p>
        </div>
        <Button onClick={handleCreateMessage}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="text-2xl font-bold">{whatsappCount}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-2xl font-bold">{emailCount}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">SMS</p>
              <p className="text-2xl font-bold">{smsCount}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Abertura</p>
              <p className="text-2xl font-bold">{openRate}%</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou destinatário..."
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
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhuma comunicação encontrada</p>
              <Button variant="link" className="mt-2">
                Enviar primeira mensagem
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Tipo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Título</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Destinatário</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Enviado em</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-surface-elevated transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          {getTypeIcon(msg.type)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{msg.title || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{msg.client?.name || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{msg.sent_at || "—"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(msg.status)}
                          <Badge className={msg.status === "replied" ? "bg-green-100 text-green-800" : msg.status === "opened" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                            {msg.status === "delivered" ? "Entregue" : msg.status === "opened" ? "Aberto" : msg.status === "replied" ? "Respondido" : "Pendente"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewMessage(msg)}>
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
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
            <DialogDescription>
              {selectedMessage?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(selectedMessage.type)}
                    <span className="capitalize">{selectedMessage.type}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedMessage.status)}
                    <span className="capitalize">{selectedMessage.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Destinatário</label>
                  <p className="font-medium">{selectedMessage.recipient}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Enviado em</label>
                  <p>{selectedMessage.sent_at}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Mensagem</label>
                <p className="mt-1 p-3 bg-surface-elevated rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleEditMessage}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Mensagem" : "Nova Mensagem"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edite as informações da mensagem" : "Preencha as informações da nova mensagem"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Mensagem</label>
                <Select
                  value={formData.type}
                  onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1"
                  options={[
                    { value: "whatsapp", label: "WhatsApp" },
                    { value: "email", label: "Email" },
                    { value: "sms", label: "SMS" },
                  ]}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Destinatário *</label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Nome do cliente"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da mensagem"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Digite sua mensagem..."
                className="mt-1 w-full p-3 border rounded-md min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMessage} disabled={!formData.client_name || !formData.message}>
              <Send className="mr-2 h-4 w-4" />
              {isEditing ? "Salvar" : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}