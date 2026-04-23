"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Mail, CheckCircle2, Send, TestTube2 } from "lucide-react"

export default function EmailSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [config, setConfig] = useState({
    from_name: "GPRAGAS",
    from_email: "noreply@gpragas.com.br",
    reply_to: "",
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    smtp_user: "",
    smtp_pass: "",
    smtp_secure: "tls",
  })

  const [templates, setTemplates] = useState({
    welcome_subject: "Bem-vindo ao portal GPRAGAS",
    welcome_body: "Olá {name}, sua conta foi criada com sucesso.",
    report_subject: "Seu laudo técnico está disponível",
    report_body: "Prezado {client}, o laudo referente ao serviço {service} está disponível.",
    reminder_subject: "Lembrete: Serviço agendado para amanhã",
    reminder_body: "Olá {client}, lembramos que o serviço {service} está agendado para {date}.",
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSendTest = () => {
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Configurações de Email</h2>
          <p className="text-muted-foreground text-sm">
            Configure o servidor de envio e templates de email
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <><CheckCircle2 className="mr-2 h-4 w-4" />Salvo!</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Salvar configurações</>
          )}
        </Button>
      </div>

      {/* Remetente */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Remetente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome do Remetente</label>
              <Input
                placeholder="Ex: GPRAGAS"
                value={config.from_name}
                onChange={(e) => setConfig((p) => ({ ...p, from_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email do Remetente</label>
              <Input
                type="email"
                placeholder="noreply@empresa.com.br"
                value={config.from_email}
                onChange={(e) => setConfig((p) => ({ ...p, from_email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Responder para (opcional)</label>
              <Input
                type="email"
                placeholder="contato@empresa.com.br"
                value={config.reply_to}
                onChange={(e) => setConfig((p) => ({ ...p, reply_to: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMTP */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Servidor SMTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Host SMTP</label>
              <Input
                placeholder="smtp.gmail.com"
                value={config.smtp_host}
                onChange={(e) => setConfig((p) => ({ ...p, smtp_host: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Porta</label>
              <Input
                placeholder="587"
                value={config.smtp_port}
                onChange={(e) => setConfig((p) => ({ ...p, smtp_port: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Usuário SMTP</label>
              <Input
                placeholder="seu@email.com"
                value={config.smtp_user}
                onChange={(e) => setConfig((p) => ({ ...p, smtp_user: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Segurança</label>
              <select
                value={config.smtp_secure}
                onChange={(e) => setConfig((p) => ({ ...p, smtp_secure: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="tls">TLS (STARTTLS)</option>
                <option value="ssl">SSL</option>
                <option value="none">Nenhuma</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-medium mb-1.5 block">Senha SMTP</label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={config.smtp_pass}
                onChange={(e) => setConfig((p) => ({ ...p, smtp_pass: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Para Gmail, use uma senha de aplicativo (App Password)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleSendTest}>
              {testSent ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />Email enviado!</>
              ) : (
                <><TestTube2 className="mr-2 h-4 w-4" />Enviar email de teste</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Templates de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Variáveis disponíveis: <code className="bg-surface-elevated px-1 rounded">{"{name}"}</code>{" "}
            <code className="bg-surface-elevated px-1 rounded">{"{client}"}</code>{" "}
            <code className="bg-surface-elevated px-1 rounded">{"{service}"}</code>{" "}
            <code className="bg-surface-elevated px-1 rounded">{"{date}"}</code>
          </p>

          {[
            { key: "welcome", label: "Boas-vindas" },
            { key: "report", label: "Laudo disponível" },
            { key: "reminder", label: "Lembrete de serviço" },
          ].map((tmpl) => (
            <div key={tmpl.key} className="border rounded-lg p-4 space-y-3">
              <p className="font-medium text-sm">{tmpl.label}</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Assunto</label>
                <Input
                  value={(templates as any)[`${tmpl.key}_subject`]}
                  onChange={(e) =>
                    setTemplates((p) => ({ ...p, [`${tmpl.key}_subject`]: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Corpo</label>
                <textarea
                  value={(templates as any)[`${tmpl.key}_body`]}
                  onChange={(e) =>
                    setTemplates((p) => ({ ...p, [`${tmpl.key}_body`]: e.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
