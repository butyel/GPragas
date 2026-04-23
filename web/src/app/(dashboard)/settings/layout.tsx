"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  Users,
  Bell,
  Shield,
  Palette,
  Mail,
} from "lucide-react"

const settingsNavigation = [
  { name: "Empresa", href: "/settings/company", icon: Building2 },
  { name: "Usuários", href: "/settings/users", icon: Users },
  { name: "Notificações", href: "/settings/notifications", icon: Bell },
  { name: "Segurança", href: "/settings/security", icon: Shield },
  { name: "Aparência", href: "/settings/appearance", icon: Palette },
  { name: "Email", href: "/settings/email", icon: Mail },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6">
      <div className="w-64 shrink-0">
        <div className="bg-surface rounded-lg border shadow-card p-4">
          <h2 className="text-lg font-semibold mb-4">Configurações</h2>
          <ul className="space-y-1">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-surface-elevated"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}