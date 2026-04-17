"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Package,
  Truck,
  BarChart3,
  Settings,
  Building2,
  FileClock,
  DollarSign,
  MessageSquare,
  Megaphone,
  Bug,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Agenda", href: "/schedule", icon: Calendar },
  { name: "Ordens de Serviço", href: "/work-orders", icon: ClipboardList },
  { name: "Laudos", href: "/reports", icon: FileText },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Técnicos", href: "/technicians", icon: Bug },
  { name: "Contratos", href: "/contracts", icon: FileClock },
  { name: "Financeiro", href: "/financial", icon: DollarSign },
  { name: "Veículos", href: "/vehicles", icon: Truck },
  { name: "Relatórios", href: "/reports/analytics", icon: BarChart3 },
  { name: "Comunicações", href: "/communications", icon: MessageSquare },
  { name: "Orçamentos", href: "/quotes", icon: Megaphone },
  { name: "Empresa", href: "/settings/company", icon: Building2 },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col bg-primary-dark text-white", className)}>
      <div className="flex h-16 items-center px-6 border-b border-primary/30">
        <Bug className="h-8 w-8 text-white/90 mr-2" />
        <span className="text-xl font-bold text-white">GPRAGAS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-secondary text-white shadow-sm"
                      : "text-white/70 hover:bg-secondary hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/settings"
          className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-secondary hover:text-white transition-all duration-200"
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </Link>
      </div>
    </div>
  )
}