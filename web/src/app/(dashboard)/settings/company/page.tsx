"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Plus,
} from "lucide-react"

export default function CompanySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dados da Empresa</h1>
          <p className="text-muted-foreground">Gerencie as informações da empresa</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Razão Social
              </label>
              <Input defaultValue="GPRAGAS Controle de Pragas Ltda" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nome Fantasia
              </label>
              <Input defaultValue="GPRAGAS" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CNPJ
              </label>
              <Input defaultValue="12.345.678/0001-90" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Inscrição Estadual
              </label>
              <Input defaultValue="123.456.789.000" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CEP
              </label>
              <Input defaultValue="01234-567" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Endereço
              </label>
              <Input defaultValue="Rua das Flores, 123" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Cidade
                </label>
                <Input defaultValue="São Paulo" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  UF
                </label>
                <Input defaultValue="SP" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Telefone Principal
              </label>
              <Input defaultValue="(11) 3000-1234" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                WhatsApp
              </label>
              <Input defaultValue="(11) 99999-1234" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input defaultValue="contato@gpragas.com.br" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Site
              </label>
              <Input defaultValue="https://gpragas.com.br" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5" />
              Responsável Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nome do RT
              </label>
              <Input defaultValue="João Silva" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CPF
              </label>
              <Input defaultValue="123.456.789-00" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                CRT (Certificado de Responsabilidade Técnica)
              </label>
              <Input defaultValue="CRT-SP-001234" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Logo e Cores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Logo atual
              </label>
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-surface-elevated">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Alterar Logo
              </Button>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Cor principal
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary" />
                <Input defaultValue="#0F766E" className="w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}