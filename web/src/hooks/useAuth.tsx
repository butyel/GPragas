"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextValue {
  user: User | null
  companyId: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  companyId: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCompanyId = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", userId)
        .single()
      return data?.company_id ?? null
    } catch {
      return null
    }
  }

  useEffect(() => {
    // Pega a sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const cid = await fetchCompanyId(session.user.id)
        setCompanyId(cid)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    // Escuta mudanças de sessão (login/logout)
    let subscription: { unsubscribe: () => void } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          try {
            setUser(session?.user ?? null)
            if (session?.user) {
              const cid = await fetchCompanyId(session.user.id)
              setCompanyId(cid)
            } else {
              setCompanyId(null)
            }
          } catch {
            // ignora erro na atualização da sessão
          } finally {
            setLoading(false)
          }
        }
      )
      subscription = data.subscription
    } catch {
      setLoading(false)
    }

    return () => {
      if (subscription) {
        try { subscription.unsubscribe() } catch {}
      }
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, companyId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
