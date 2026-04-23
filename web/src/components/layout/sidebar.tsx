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
  FileClock,
  DollarSign,
  MessageSquare,
  Megaphone,
  Bug,
  Wrench,
  LogOut,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Agenda", href: "/schedule", icon: Calendar },
  { name: "Ordens de Serviço", href: "/work-orders", icon: ClipboardList },
  { name: "Laudos", href: "/reports", icon: FileText },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Técnicos", href: "/technicians", icon: Wrench },
  { name: "Contratos", href: "/contracts", icon: FileClock },
  { name: "Financeiro", href: "/financial", icon: DollarSign },
  { name: "Veículos", href: "/vehicles", icon: Truck },
  { name: "Orçamentos", href: "/quotes", icon: Megaphone },
  { name: "Comunicações", href: "/communications", icon: MessageSquare },
  { name: "Analytics", href: "/reports/analytics", icon: BarChart3 },
  { name: "Configurações", href: "/settings/company", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col bg-[#001529] text-white/70", className)}>
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Bug className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">GPRAGAS</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-[#1890ff]/20 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  )} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-destructive transition-all">
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}