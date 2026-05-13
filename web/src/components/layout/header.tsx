"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, User, LogOut, ChevronDown, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface HeaderProps {
  companyName?: string
  className?: string
}

export function Header({
  companyName = "SmartPrag",
  className,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Usuário"
  const userRole = "Administrador"

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-white px-4 md:px-6",
        className
      )}
    >
      <div className="flex items-center flex-1">
        <button 
          className="md:hidden mr-3 p-2 rounded-lg hover:bg-muted"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className={cn("relative w-full max-w-md", searchOpen ? "block" : "hidden md:block")}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes, OS, relatórios..."
            className="pl-10 bg-muted border-0 rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-dropdown">
            <DropdownMenuLabel className="py-3">
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">{companyName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/company")} className="rounded-lg py-3">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/company")} className="rounded-lg py-3">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="rounded-lg py-3 text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}