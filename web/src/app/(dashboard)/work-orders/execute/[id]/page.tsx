"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Camera,
  PenTool,
  MapPin,
  User,
  Bug,
  Save,
  Loader2,
  Plus,
  X,
  ChevronRight,
} from "lucide-react"
import { getWorkOrderById, getProducts } from "@/lib/data"
import { supabase } from "@/lib/supabase"

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

export default function ExecuteWorkOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [order, setOrder] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  const [selectedProducts, setSelectedProducts] = useState<{product: any, quantity: number}[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [newQuantity, setNewQuantity] = useState("1")

  const [foundPests, setFoundPests] = useState<string[]>([])
  const [serviceNotes, setServiceNotes] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [signature, setSignature] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const steps = ["Início", "Produtos", "Serviço", "Fotos", "Assinatura"]

  useEffect(() => {
    async function loadData() {
      try {
        const [wo, prod] = await Promise.all([
          getWorkOrderById(orderId),
          getProducts("11111111-1111-1111-1111-111111111111")
        ])
        setOrder(wo)
        setProducts(prod || [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [orderId])

  const togglePest = (pest: string) => {
    setFoundPests(prev =>
      prev.includes(pest)
        ? prev.filter(p => p !== pest)
        : [...prev, pest]
    )
  }

  const addProduct = () => {
    const product = products.find(p => p.id === newProduct)
    if (product && parseFloat(newQuantity) > 0) {
      setSelectedProducts(prev => {
        const exists = prev.find(p => p.product.id === product.id)
        if (exists) {
          return prev.map(p => p.product.id === product.id
            ? { ...p, quantity: p.quantity + parseFloat(newQuantity) }
            : p
          )
        }
        return [...prev, { product, quantity: parseFloat(newQuantity) }]
      })
      setNewProduct("")
      setNewQuantity("1")
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product.id !== productId))
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = "#0F766E"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.stroke()
    setLastPos({ x, y })
  }

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setSignature(canvasRef.current.toDataURL())
    }
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSignature("")
  }

  const canProceed = () => {
    if (currentStep === 0) return true
    if (currentStep === 1) return selectedProducts.length > 0
    if (currentStep === 2) return true
    if (currentStep === 3) return photos.length > 0 || true
    return true
  }

  const handleSave = async () => {
    if (!order || !order.id) return
    setSaving(true)
    try {
      const { error } = await supabase.from("work_orders").update({
        status: "completed",
        executed_at: new Date().toISOString(),
        executed_products: selectedProducts.map(p => ({
          product_id: p.product.id,
          product_name: p.product.name,
          quantity: p.quantity,
        })),
        found_pests: foundPests,
        service_notes: serviceNotes,
        signature_data: signature,
      }).eq("id", order.id)

      if (error) throw error
      router.push("/work-orders")
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ordem de serviço não encontrada</p>
        <Link href="/work-orders">
          <Button className="mt-4">Voltar para lista</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/work-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Executar OS {order.id}</h1>
          <p className="text-muted-foreground">
            {order.client?.name} - {order.service_type?.name}
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          {order.status === "scheduled" ? "Agendada" :
           order.status === "in_transit" ? "Em deslocamento" :
           order.status === "in_progress" ? "Em execução" : order.status}
        </Badge>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < currentStep
                    ? "bg-green-500 text-white"
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
              <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < currentStep ? "bg-green-500" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Início */}
      {currentStep === 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Informações do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.client?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Serviço</p>
                <p className="font-medium">{order.service_type?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Técnico</p>
                <p className="font-medium">{order.technician?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data/Hora</p>
                <p className="font-medium">{order.scheduled_date} às {order.scheduled_time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Endereço</p>
                <p className="font-medium">{order.address}, {order.city}/{order.state}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Pragas-alvo</p>
                <div className="flex gap-1 mt-1">
                  {order.target_pests?.map((pest: string) => (
                    <Badge key={pest} variant="outline">{pest}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">Verificações antes de iniciar:</p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Checar se o local está preparado para aplicação</li>
                <li>• Verificar produtos necessários</li>
                <li>• Observar condições de segurança</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1 — Produtos */}
      {currentStep === 1 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Produtos Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione os produtos utilizados neste serviço:
            </p>

            <div className="flex gap-2">
              <select
                className="flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
              >
                <option value="">Selecione o produto...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.active_ingredient}</option>
                ))}
              </select>
              <Input
                type="number"
                className="w-20"
                min="1"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
              <Button onClick={addProduct}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {selectedProducts.length > 0 ? (
              <div className="space-y-2 mt-4">
                {selectedProducts.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between bg-surface-elevated p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.active_ingredient}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Qtd: {quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeProduct(product.id)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum produto adicionado
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Serviço */}
      {currentStep === 2 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" /> Realização do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Pragas encontradas no local <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Selecione as pragas que foram identificadas durante o serviço:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {pestTypes.map(pest => {
                  const selected = foundPests.includes(pest)
                  return (
                    <button
                      key={pest}
                      onClick={() => togglePest(pest)}
                      className={`p-2 rounded-lg border-2 text-sm text-left transition-all ${
                        selected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-border hover:border-red-300"
                      }`}
                    >
                      {selected ? "●" : "○"} {pest}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Observações do serviço
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2"
                rows={4}
                placeholder="Descreva as condições encontradas, observações, recomendações..."
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Fotos */}
      {currentStep === 3 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" /> Fotos do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tire fotos do local antes e depois do tratamento. Recomenda-se:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Foto do local antes do tratamento</li>
              <li>• Foto dos pontos de infestação</li>
              <li>• Foto dos produtos aplicados</li>
              <li>• Foto do local após o tratamento</li>
            </ul>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Funcionalidade de câmera em desenvolvimento
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Por sementara, adicione URLs de fotos
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Fotos adicionadas ({photos.length})</p>
              {photos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma foto adicionada</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative aspect-square bg-surface-elevated rounded-lg">
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 bg-white"
                        onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 — Assinatura */}
      {currentStep === 4 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" /> Assinatura do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Peça ao cliente para assinar no espaço abaixo, confirmando a realização do serviço:
            </p>

            <div className="border border-border rounded-lg bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <Button variant="outline" onClick={clearSignature} className="w-full">
              <X className="h-4 w-4 mr-2" /> Limpar assinatura
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Ao assinar, o cliente confirma a execução do serviço conforme descrito.
                Uma cópia será enviada por e-mail.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/work-orders">
            <Button variant="ghost">Cancelar</Button>
          </Link>
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!canProceed()}>
              Próximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Finalizar Serviço
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}