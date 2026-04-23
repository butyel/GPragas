"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Plus,
  Search,
  Mail,
  Shield,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react"

const mockUsers = [
  {
    id: "1",
    full_name: "Administrador Principal",
    email: "admin@gpragas.com.br",
    role: "admin",
    status: "active",
    last_login: "2026-04-20",
  },
  {
    id: "2",
    full_name: "Carlos Gerente",
    email: "gerente@gpragas.com.br",
    role: "manager",
    status: "active",
    last_login: "2026-04-19",
  },
  {
    id: "3",
    full_name: "João Silva",
    email: "joao.silva@gpragas.com.br",
    role: "technician",
    status: "active",
    last_login: "2026-04-20",
  },
  {
    id: "4",
    full_name: "Maria Santos",
    email: "maria.santos@gpragas.com.br",
    role: "technician",
    status: "active",
    last_login: "2026-04-20",
  },
  {
    id: "5",
    full_name: "Pedro Visualizador",
    email: "pedro@gpragas.com.br",
    role: "viewer",
    status: "inactive",
    last_login: "2026-03-10",
  },
]

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  technician: "Técnico",
  viewer: "Visualizador",
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-blue-100 text-blue-800",
  technician: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800",
}

export default function UsersSettingsPage() {
  const [search, setSearch] = useState("")
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "viewer",
  })

  const filtered = mockUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Usuários</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie quem tem acesso ao sistema
          </p>
        </div>
        <Button onClick={() => setIsNewUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Convidar Usuário
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", count: mockUsers.length, color: "bg-primary-50 text-primary" },
          { label: "Ativos", count: mockUsers.filter((u) => u.status === "active").length, color: "bg-green-50 text-green-700" },
          { label: "Técnicos", count: mockUsers.filter((u) => u.role === "technician").length, color: "bg-blue-50 text-blue-700" },
          { label: "Admins", count: mockUsers.filter((u) => u.role === "admin").length, color: "bg-red-50 text-red-700" },
        ].map((item) => (
          <Card key={item.label} className="shadow-card">
            <CardContent className={`p-4 flex items-center justify-between ${item.color} rounded-lg`}>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-2xl font-bold">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Busca */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-surface-elevated border-b">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Usuário</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Perfil</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Último acesso</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b hover:bg-surface-elevated transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.last_login}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
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
        </CardContent>
      </Card>

      {/* Modal convidar */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Usuário</DialogTitle>
            <DialogDescription>
              Envie um convite por email para um novo usuário acessar o sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome Completo</label>
              <Input
                placeholder="Nome do usuário"
                value={newUser.full_name}
                onChange={(e) => setNewUser((p) => ({ ...p, full_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="email@empresa.com"
                value={newUser.email}
                onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Perfil de Acesso</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="viewer">Visualizador — apenas leitura</option>
                <option value="technician">Técnico — acessa OSs atribuídas</option>
                <option value="manager">Gerente — gestão completa</option>
                <option value="admin">Administrador — acesso total</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsNewUserOpen(false)}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
