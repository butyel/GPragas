"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Clock,
} from "lucide-react"

export default function SecuritySettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("60")
  const [saved, setSaved] = useState(false)

  const passwordStrength = () => {
    const p = passwords.new
    if (p.length === 0) return null
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return { label: "Fraca", color: "bg-red-500", width: "25%" }
    if (score === 2) return { label: "Média", color: "bg-yellow-500", width: "50%" }
    if (score === 3) return { label: "Boa", color: "bg-blue-500", width: "75%" }
    return { label: "Forte", color: "bg-green-500", width: "100%" }
  }

  const strength = passwordStrength()

  const recentSessions = [
    { device: "Chrome — Windows 11", ip: "177.x.x.x", time: "Agora", current: true },
    { device: "Mobile Safari — iOS", ip: "177.x.x.x", time: "Há 2 dias", current: false },
    { device: "Firefox — Ubuntu", ip: "200.x.x.x", time: "Há 5 dias", current: false },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Segurança</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie sua senha e configurações de segurança
          </p>
        </div>
      </div>

      {/* Alteração de senha */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Senha atual</label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Nova senha</label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className={`text-xs mt-1 font-medium ${
                  strength.label === "Forte" ? "text-green-600" :
                  strength.label === "Boa" ? "text-blue-600" :
                  strength.label === "Média" ? "text-yellow-600" : "text-red-600"
                }`}>
                  Força: {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Confirmar nova senha</label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                className={
                  passwords.confirm && passwords.new !== passwords.confirm
                    ? "border-red-500"
                    : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm}
          >
            <Save className="mr-2 h-4 w-4" />
            Alterar senha
          </Button>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Autenticação em Dois Fatores (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {twoFactor ? "2FA ativado" : "2FA desativado"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {twoFactor
                  ? "Sua conta está protegida com verificação em duas etapas."
                  : "Adicione uma camada extra de segurança à sua conta."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {twoFactor && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Ativo
                </div>
              )}
              <Button
                variant={twoFactor ? "outline" : "default"}
                onClick={() => setTwoFactor(!twoFactor)}
              >
                {twoFactor ? "Desativar" : "Ativar 2FA"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeout de sessão */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Tempo de Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tempo de inatividade antes de encerrar a sessão automaticamente.
          </p>
          <div className="flex items-center gap-4">
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm w-52"
            >
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
              <option value="480">8 horas</option>
              <option value="0">Nunca expirar</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleSave}>
              {saved ? "Salvo!" : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessões ativas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Sessões Ativas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <div>
                <p className="text-sm font-medium">{session.device}</p>
                <p className="text-xs text-muted-foreground">
                  IP: {session.ip} · {session.time}
                </p>
              </div>
              {session.current ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  Sessão atual
                </span>
              ) : (
                <Button variant="ghost" size="sm" className="text-destructive text-xs">
                  Encerrar
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2 text-destructive border-destructive/30">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Encerrar todas as outras sessões
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
