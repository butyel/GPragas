"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Palette, Sun, Moon, Monitor, CheckCircle2 } from "lucide-react"

const accentColors = [
  { name: "Teal (padrão)", value: "#0F766E", class: "bg-teal-700" },
  { name: "Azul", value: "#2563EB", class: "bg-blue-600" },
  { name: "Verde", value: "#16A34A", class: "bg-green-600" },
  { name: "Roxo", value: "#7C3AED", class: "bg-violet-600" },
  { name: "Laranja", value: "#EA580C", class: "bg-orange-600" },
  { name: "Rosa", value: "#DB2777", class: "bg-pink-600" },
]

const fontOptions = [
  { value: "inter", label: "Inter (padrão)" },
  { value: "roboto", label: "Roboto" },
  { value: "outfit", label: "Outfit" },
  { value: "system", label: "Fonte do sistema" },
]

const densityOptions = [
  { value: "compact", label: "Compacto", desc: "Mais informações por tela" },
  { value: "normal", label: "Normal", desc: "Equilíbrio entre espaço e conteúdo" },
  { value: "comfortable", label: "Confortável", desc: "Maior espaçamento" },
]

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [accent, setAccent] = useState("#0F766E")
  const [font, setFont] = useState("inter")
  const [density, setDensity] = useState("normal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Aparência</h2>
          <p className="text-muted-foreground text-sm">
            Personalize a aparência do sistema
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <><CheckCircle2 className="mr-2 h-4 w-4" />Salvo!</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Salvar preferências</>
          )}
        </Button>
      </div>

      {/* Tema */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Tema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light" as const, label: "Claro", icon: Sun, preview: "bg-white border-2 border-border" },
              { value: "dark" as const, label: "Escuro", icon: Moon, preview: "bg-slate-900 border-2 border-border" },
              { value: "system" as const, label: "Sistema", icon: Monitor, preview: "bg-gradient-to-br from-white to-slate-900 border-2 border-border" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  theme === t.value ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`h-16 rounded-md mx-auto mb-3 ${t.preview} flex items-center justify-center`}>
                  <t.icon className={`h-6 w-6 ${t.value === "dark" ? "text-white" : "text-slate-700"}`} />
                </div>
                <p className="text-sm font-medium">{t.label}</p>
                {theme === t.value && (
                  <CheckCircle2 className="h-4 w-4 text-primary mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cor de destaque */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Cor de Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccent(color.value)}
                title={color.name}
                className={`h-10 w-10 rounded-full ${color.class} flex items-center justify-center transition-all ${
                  accent === color.value ? "ring-2 ring-offset-2 ring-current scale-110" : "hover:scale-105"
                }`}
              >
                {accent === color.value && (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Cor selecionada: <span className="font-mono">{accent}</span>
          </p>
        </CardContent>
      </Card>

      {/* Tipografia */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Fonte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {fontOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFont(f.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  font === f.value ? "border-primary bg-primary-50" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-medium text-sm">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Aa Bb Cc 123
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Densidade */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Densidade da Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {densityOptions.map((d) => (
              <button
                key={d.value}
                onClick={() => setDensity(d.value)}
                className={`w-full p-4 rounded-lg border-2 text-left flex items-center justify-between transition-all ${
                  density === d.value ? "border-primary bg-primary-50" : "border-border hover:border-primary/40"
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
                {density === d.value && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Sidebar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sidebar recolhida por padrão</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Iniciar com a navegação lateral minimizada
              </p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                sidebarCollapsed ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  sidebarCollapsed ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
