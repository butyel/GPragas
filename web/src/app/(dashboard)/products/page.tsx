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
  Package,
  Search,
  Plus,
  Package2,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
  FlaskConical,
  Loader2,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getProducts, getProductById } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

const categoryOptions = [
  { value: "", label: "Todas as categorias" },
  { value: "gel", label: "Gel" },
  { value: "spray", label: "Spray" },
  { value: "isca", label: "Isca" },
  { value: "raticida", label: "Raticida" },
  { value: "liquido", label: "Líquido" },
]

const getCategoryLabel = (category: string) => {
  if (!category) return "—"
  const labels: Record<string, string> = {
    gel: "Gel",
    spray: "Spray",
    isca: "Isca",
    raticida: "Raticida",
    liquido: "Líquido",
  }
  return labels[category] || category
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    active_ingredient: "",
    manufacturer: "",
    supplier: "",
    registration_mapa: "",
    concentration: "",
    unit: "un",
    stock: 0,
    min_stock: 0,
    cost_price: 0,
    sale_price: 0,
    expiration_date: "",
  })

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts(MOCK_COMPANY_ID)
        setProducts(data || [])
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase()
    const matchesSearch =
      product.name?.toLowerCase().includes(term) ||
      product.sku?.toLowerCase().includes(term) ||
      product.active_ingredient?.toLowerCase().includes(term)
    const matchesCategory = !category || product.category === category
    return matchesSearch && matchesCategory
  })

  const handleViewProduct = async (product: any) => {
    try {
      const fullProduct = await getProductById(product.id)
      setSelectedProduct(fullProduct)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      setSelectedProduct(product)
      setIsModalOpen(true)
    }
  }

  const getStatus = (product: any) => {
    const stock = product.stock || 0
    const minStock = product.min_stock || 0
    if (!product.active) return "inactive"
    if (stock <= 0) return "out_of_stock"
    if (stock <= minStock) return "low_stock"
    return "active"
  }

  const statusCounts = {
    active: products.filter((p) => getStatus(p) === "active").length,
    low_stock: products.filter((p) => getStatus(p) === "low_stock").length,
    out_of_stock: products.filter((p) => getStatus(p) === "out_of_stock").length,
  }

  const totalStockValue = products.reduce((acc, p) => acc + ((p.sale_price || 0) * (p.stock || 0)), 0)

  const handleCreateProduct = () => {
    setFormData({
      name: "",
      sku: "",
      category: "",
      active_ingredient: "",
      manufacturer: "",
      supplier: "",
      registration_mapa: "",
      concentration: "",
      unit: "un",
      stock: 0,
      min_stock: 0,
      cost_price: 0,
      sale_price: 0,
      expiration_date: "",
    })
    setIsEditing(false)
    setIsCreateModalOpen(true)
  }

  const handleEditProduct = () => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        active_ingredient: selectedProduct.active_ingredient || "",
        manufacturer: selectedProduct.manufacturer || "",
        supplier: selectedProduct.supplier || "",
        registration_mapa: selectedProduct.registration_mapa || "",
        concentration: selectedProduct.concentration || "",
        unit: selectedProduct.unit || "un",
        stock: selectedProduct.stock || 0,
        min_stock: selectedProduct.min_stock || 0,
        cost_price: selectedProduct.cost_price || 0,
        sale_price: selectedProduct.sale_price || 0,
        expiration_date: selectedProduct.expiration_date || "",
      })
      setIsEditing(true)
      setIsCreateModalOpen(true)
    }
  }

  const handleSaveProduct = async () => {
    try {
      const newProduct = {
        ...formData,
        id: isEditing ? selectedProduct?.id : `PROD-${Date.now()}`,
        company_id: MOCK_COMPANY_ID,
        active: true,
      }
      
      if (isEditing) {
        setProducts(prev => prev.map(p => p.id === selectedProduct?.id ? { ...p, ...newProduct } : p))
      } else {
        setProducts(prev => [...prev, newProduct])
      }
      
      setIsCreateModalOpen(false)
      alert(isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro ao salvar produto")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Catálogo de produtos e insumos</p>
        </div>
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold">{statusCounts.active}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estoque Baixo</p>
              <p className="text-2xl font-bold">{statusCounts.low_stock}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sem Estoque</p>
              <p className="text-2xl font-bold">{statusCounts.out_of_stock}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor em Estoque</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalStockValue)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, SKU ou princípio ativo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-48"
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Produto</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Registro</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Princípio Ativo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Estoque</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Valor Unit.</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStatus(product)
                    return (
                      <tr key={product.id} className="border-b hover:bg-surface-elevated transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                              <FlaskConical className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.manufacturer || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm">{product.registration_mapa || "—"}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{product.active_ingredient || "—"}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.stock || 0}</span>
                            <span className="text-xs text-muted-foreground">
                              / {product.unit || "un"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{formatCurrency(product.sale_price || 0)}</span>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              status === "active"
                                ? "bg-green-100 text-green-800"
                                : status === "low_stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : status === "out_of_stock"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {status === "active"
                              ? "Ativo"
                              : status === "low_stock"
                              ? "Estoque Baixo"
                              : status === "out_of_stock"
                              ? "Sem Estoque"
                              : "Inativo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewProduct(product)}>
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
            <DialogDescription>
              Informações completas do produto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registro MAPA/ANVISA</label>
                  <p className="font-mono">{selectedProduct.registration_mapa || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fabricante</label>
                  <p>{selectedProduct.manufacturer || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
                  <p>{selectedProduct.supplier || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Princípio Ativo</label>
                  <p>{selectedProduct.active_ingredient || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Concentração</label>
                  <p>{selectedProduct.concentration || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unidade</label>
                  <p>{selectedProduct.unit || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estoque</label>
                  <p className="font-medium">{selectedProduct.stock || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estoque Mínimo</label>
                  <p>{selectedProduct.min_stock || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preço de Custo</label>
                  <p className="font-medium">{formatCurrency(selectedProduct.cost_price || 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor Venda</label>
                  <p className="font-medium text-green-600">{formatCurrency(selectedProduct.sale_price || 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Validade</label>
                  <p>{selectedProduct.expiration_date ? new Date(selectedProduct.expiration_date).toLocaleDateString("pt-BR") : "—"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleEditProduct}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edite as informações do produto" : "Preencha as informações do novo produto"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do produto"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">SKU</label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Código SKU"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Categoria</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1"
                options={categoryOptions}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Princípio Ativo</label>
              <Input
                value={formData.active_ingredient}
                onChange={(e) => setFormData({ ...formData, active_ingredient: e.target.value })}
                placeholder="Ex: Fipronil"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fabricante</label>
              <Input
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Nome do fabricante"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nome do fornecedor"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Registro MAPA/ANVISA</label>
              <Input
                value={formData.registration_mapa}
                onChange={(e) => setFormData({ ...formData, registration_mapa: e.target.value })}
                placeholder="Número de registro"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Concentração</label>
              <Input
                value={formData.concentration}
                onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                placeholder="Ex: 0,5%"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Unidade</label>
              <Select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="mt-1"
                options={[
                  { value: "un", label: "Unidade" },
                  { value: "kg", label: "Kg" },
                  { value: "l", label: "Litro" },
                  { value: "ml", label: "ml" },
                  { value: "g", label: "g" },
                ]}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estoque</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estoque Mínimo</label>
              <Input
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preço de Custo</label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valor Venda</label>
              <Input
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Validade</label>
              <Input
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} disabled={!formData.name}>
              <Plus className="mr-2 h-4 w-4" />
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}