"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Bell, Mail, MessageSquare, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react"

interface NotifSetting {
  id: string
  label: string
  description: string
  icon: React.ElementType
  email: boolean
  push: boolean
  whatsapp: boolean
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotifSetting[]>([
    {
      id: "new_work_order",
      label: "Nova OS atribuída",
      description: "Quando uma ordem de serviço é atribuída ao técnico",
      icon: CheckCircle2,
      email: true,
      push: true,
      whatsapp: false,
    },
    {
      id: "os_status_change",
      label: "Mudança de status da OS",
      description: "Quando o status de uma OS é atualizado",
      icon: AlertTriangle,
      email: true,
      push: true,
      whatsapp: false,
    },
    {
      id: "schedule_reminder",
      label: "Lembrete de agendamento",
      description: "Lembrete 1 hora antes de um serviço agendado",
      icon: Calendar,
      email: true,
      push: true,
      whatsapp: true,
    },
    {
      id: "report_generated",
      label: "Laudo gerado",
      description: "Quando um laudo técnico é gerado e aguarda aprovação",
      icon: CheckCircle2,
      email: true,
      push: false,
      whatsapp: false,
    },
    {
      id: "payment_due",
      label: "Vencimento de pagamento",
      description: "Alerta de fatura próxima do vencimento",
      icon: AlertTriangle,
      email: true,
      push: false,
      whatsapp: true,
    },
    {
      id: "client_message",
      label: "Mensagem de cliente",
      description: "Quando um cliente envia uma mensagem pelo portal",
      icon: MessageSquare,
      email: true,
      push: true,
      whatsapp: false,
    },
  ])
  const [saved, setSaved] = useState(false)

  const toggle = (id: string, channel: "email" | "push" | "whatsapp") => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s))
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notificações</h2>
          <p className="text-muted-foreground text-sm">
            Configure como e quando você recebe alertas
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar preferências
            </>
          )}
        </Button>
      </div>

      {/* Canais legend */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span>Push (navegador)</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span>WhatsApp</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification list */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="divide-y">
            {settings.map((setting) => (
              <div key={setting.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  {/* Email toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      onClick={() => toggle(setting.id, "email")}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        setting.email ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          setting.email ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {/* Push toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      onClick={() => toggle(setting.id, "push")}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        setting.push ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          setting.push ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {/* WhatsApp toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      onClick={() => toggle(setting.id, "whatsapp")}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        setting.whatsapp ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          setting.whatsapp ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Horário de silêncio */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Horário de Silêncio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Pausar notificações push fora do horário comercial
          </p>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Das</label>
            <input type="time" defaultValue="22:00" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <label className="text-sm font-medium">às</label>
            <input type="time" defaultValue="07:00" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
