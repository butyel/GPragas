"use client"

import { useState } from "react"
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
  User,
  Building2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

const segmentOptions = [
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "food_service", label: "Food Service" },
  { value: "hospital", label: "Hospitalar" },
]

const stateOptions = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AM", label: "AM" },
  { value: "AP", label: "AP" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MG", label: "MG" },
  { value: "MS", label: "MS" },
  { value: "MT", label: "MT" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "PR", label: "PR" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "RS", label: "RS" },
  { value: "SC", label: "SC" },
  { value: "SE", label: "SE" },
  { value: "SP", label: "SP" },
  { value: "TO", label: "TO" },
]

interface FormData {
  type: "pf" | "pj"
  name: string
  document: string
  email: string
  phone: string
  segment: string
  address: string
  city: string
  state: string
  zip_code: string
  notes: string
}

export default function NewClientPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [form, setForm] = useState<FormData>({
    type: "pj",
    name: "",
    document: "",
    email: "",
    phone: "",
    segment: "commercial",
    address: "",
    city: "",
    state: "SP",
    zip_code: "",
    notes: "",
  })

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!form.document.trim()) newErrors.document = "Documento é obrigatório"
    if (!form.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!form.segment) newErrors.segment = "Segmento é obrigatório"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const MOCK_COMPANY_ID = "11111111-1111-1111-1111-111111111111"

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const { error } = await supabase.from("clients").insert({
        company_id: MOCK_COMPANY_ID,
        type: form.type,
        name: form.name.trim(),
        document: form.document.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        segment: form.segment,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state || null,
        zip_code: form.zip_code.trim() || null,
        notes: form.notes.trim() || null,
        score: 100,
      })

      if (error) throw error
      router.push("/clients")
    } catch (err) {
      console.error("Erro ao salvar cliente:", err)
      alert("Erro ao salvar cliente. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Cliente</h1>
          <p className="text-muted-foreground">Cadastre um novo cliente no sistema</p>
        </div>
      </div>

      {/* Tipo de pessoa */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Tipo de Pessoa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => handleChange("type", "pj")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                form.type === "pj"
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Building2 className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Pessoa Jurídica</p>
                <p className="text-xs text-muted-foreground">CNPJ</p>
              </div>
            </button>
            <button
              onClick={() => handleChange("type", "pf")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                form.type === "pf"
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <User className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Pessoa Física</p>
                <p className="text-xs text-muted-foreground">CPF</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Dados principais */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Dados Principais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">
                {form.type === "pj" ? "Razão Social / Nome Fantasia" : "Nome Completo"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder={form.type === "pj" ? "Ex: Restaurante Sabor Caseiro Ltda" : "Ex: João da Silva"}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {form.type === "pj" ? "CNPJ" : "CPF"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder={form.type === "pj" ? "00.000.000/0001-00" : "000.000.000-00"}
                value={form.document}
                onChange={(e) => handleChange("document", e.target.value)}
                className={`font-mono ${errors.document ? "border-red-500" : ""}`}
              />
              {errors.document && <p className="text-xs text-red-500 mt-1">{errors.document}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Segmento
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                options={segmentOptions}
                value={form.segment}
                onChange={(e) => handleChange("segment", e.target.value)}
                className={errors.segment ? "border-red-500" : ""}
              />
              {errors.segment && <p className="text-xs text-red-500 mt-1">{errors.segment}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Telefone / WhatsApp
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <Input
                type="email"
                placeholder="contato@empresa.com.br"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Logradouro</label>
              <Input
                placeholder="Rua, Av., número, complemento"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">CEP</label>
              <Input
                placeholder="00000-000"
                value={form.zip_code}
                onChange={(e) => handleChange("zip_code", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
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
        </CardContent>
      </Card>

      {/* Observações */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="Informações adicionais, preferências, histórico relevante..."
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/clients">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Cliente
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
