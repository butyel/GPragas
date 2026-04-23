"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  User,
  Bug,
  MapPin,
  Package,
  ChevronRight,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getClients, getTechnicians } from "@/lib/data"

const serviceTypes = [
  { value: "desinsetizacao", label: "Desinsetização" },
  { value: "desratizacao", label: "Desratização" },
  { value: "dedetizacao", label: "Dedetização Completa" },
  { value: "mip", label: "MIP - Manejo Integrado de Pragas" },
  { value: "sanitizacao", label: "Sanitização" },
  { value: "termitas", label: "Controle de Cupins" },
  { value: "escorpioes", label: "Controle de Escorpiões" },
]

const pestTypes = [
  "Baratas",
  "Ratos/Camundongos",
  "Formigas",
  "Cupins",
  "Moscas",
  "Mosquitos",
  "Escorpiões",
  "Aranhas",
  "Pombos",
  "Percevejos",
]

const stateOptions = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG",
  "MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR",
  "RS","SC","SE","SP","TO",
].map((s) => ({ value: s, label: s }))

const steps = ["Dados Básicos", "Local e Data", "Pragas e Produtos", "Revisão"]

export default function NewWorkOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)

  const [form, setForm] = useState({
    client_id: "",
    technician_id: "",
    service_type: "",
    scheduled_date: "",
    scheduled_time: "",
    address: "",
    city: "",
    state: "SP",
    zip_code: "",
    target_pests: [] as string[],
    value: "",
    notes: "",
    priority: "normal",
  })

  const MOCK_COMPANY_ID = "demo-company"

  useEffect(() => {
    async function loadData() {
      setCompanyId(MOCK_COMPANY_ID)

      const [c, t] = await Promise.all([
        getClients(MOCK_COMPANY_ID),
        getTechnicians(MOCK_COMPANY_ID),
      ])
      setClients(c || [])
      setTechnicians(t || [])
    }
    loadData()
  }, [])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const togglePest = (pest: string) => {
    setForm((prev) => ({
      ...prev,
      target_pests: prev.target_pests.includes(pest)
        ? prev.target_pests.filter((p) => p !== pest)
        : [...prev.target_pests, pest],
    }))
  }

  const canProceed = () => {
    if (currentStep === 0) return form.client_id && form.service_type && form.technician_id
    if (currentStep === 1) return form.scheduled_date && form.scheduled_time
    if (currentStep === 2) return form.target_pests.length > 0
    return true
  }

  const handleSave = async () => {
    if (!companyId) return
    setSaving(true)
    try {
      const { error } = await supabase.from("work_orders").insert({
        company_id: companyId,
        client_id: form.client_id,
        technician_id: form.technician_id || null,
        service_type_id: form.service_type,
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip_code: form.zip_code || null,
        target_pests: form.target_pests,
        value: form.value ? parseFloat(form.value) : null,
        notes: form.notes || null,
        priority: form.priority,
        status: "scheduled",
      })
      if (error) throw error
      router.push("/work-orders")
    } catch (err) {
      console.error("Erro ao criar OS:", err)
      alert("Erro ao salvar. Verifique os dados e tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const selectedClient = clients.find((c) => c.id === form.client_id)
  const selectedTech = technicians.find((t) => t.id === form.technician_id)
  const selectedService = serviceTypes.find((s) => s.value === form.service_type)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/work-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova Ordem de Serviço</h1>
          <p className="text-muted-foreground">Crie uma nova OS e atribua ao técnico</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < currentStep
                    ? "bg-primary text-white"
                    : i === currentStep
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-surface-elevated text-muted-foreground border"
                }`}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Dados Básicos */}
      {currentStep === 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Dados Básicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Cliente <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: "", label: "Selecione o cliente..." },
                  ...clients.map((c) => ({ value: c.id, label: c.name })),
                ]}
                value={form.client_id}
                onChange={(e) => handleChange("client_id", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Tipo de Serviço <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: "", label: "Selecione o serviço..." },
                  ...serviceTypes,
                ]}
                value={form.service_type}
                onChange={(e) => handleChange("service_type", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Técnico Responsável <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: "", label: "Selecione o técnico..." },
                  ...technicians.map((t) => ({
                    value: t.id,
                    label: t.name || t.user?.full_name || "Técnico",
                  })),
                ]}
                value={form.technician_id}
                onChange={(e) => handleChange("technician_id", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Prioridade</label>
                <Select
                  options={[
                    { value: "low", label: "Baixa" },
                    { value: "normal", label: "Normal" },
                    { value: "high", label: "Alta" },
                    { value: "urgent", label: "Urgente" },
                  ]}
                  value={form.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Valor (R$)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={form.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1 — Local e Data */}
      {currentStep === 1 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Local e Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Data <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(e) => handleChange("scheduled_date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Horário <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={form.scheduled_time}
                  onChange={(e) => handleChange("scheduled_time", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Logradouro</label>
              <Input
                placeholder="Rua, Av., número, complemento"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Cidade</label>
                <Input
                  placeholder="Cidade"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Estado</label>
                <Select
                  options={stateOptions}
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Observações</label>
              <textarea
                placeholder="Instruções de acesso, observações para o técnico..."
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Pragas */}
      {currentStep === 2 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" /> Pragas-Alvo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione as pragas que serão tratadas nesta OS:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pestTypes.map((pest) => {
                const selected = form.target_pests.includes(pest)
                return (
                  <button
                    key={pest}
                    onClick={() => togglePest(pest)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                      selected
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-border hover:border-primary/40 hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="mr-2">{selected ? "✓" : "○"}</span>
                    {pest}
                  </button>
                )
              })}
            </div>
            {form.target_pests.length > 0 && (
              <p className="text-sm text-primary mt-4 font-medium">
                {form.target_pests.length} praga(s) selecionada(s)
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Revisão */}
      {currentStep === 3 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Revisão da OS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{selectedClient?.name || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Serviço</p>
                <p className="font-medium">{selectedService?.label || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Técnico</p>
                <p className="font-medium">
                  {selectedTech?.name || selectedTech?.user?.full_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Prioridade</p>
                <p className="font-medium capitalize">{form.priority}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data/Hora</p>
                <p className="font-medium">
                  {form.scheduled_date} às {form.scheduled_time}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor</p>
                <p className="font-medium">
                  {form.value ? `R$ ${parseFloat(form.value).toFixed(2)}` : "—"}
                </p>
              </div>
              {(form.city || form.address) && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Local</p>
                  <p className="font-medium">
                    {form.address && `${form.address}, `}{form.city}/{form.state}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-muted-foreground">Pragas-alvo</p>
                <p className="font-medium">{form.target_pests.join(", ") || "—"}</p>
              </div>
              {form.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Observações</p>
                  <p className="font-medium">{form.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/work-orders">
            <Button variant="ghost">Cancelar</Button>
          </Link>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Próximo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando OS...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar OS
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
