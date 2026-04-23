"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, Loader2, Users, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-5 shadow-glow">
            <Bug className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">GPRAGAS</h1>
          <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão de Pragas</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Bem-vindo</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Entre com suas credenciais
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-muted border-0 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted border-0 rounded-xl h-12 px-4 pr-12 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all text-white flex items-center justify-center shadow-glow hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center space-y-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Nova empresa? </span>
              <a href="#" className="text-primary hover:underline font-medium">
                Criar conta
              </a>
            </div>
            
            <a href="#" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 border border-border/50 transition-all">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Acesso Colaborador</span>
            </a>
          </div>
        </div>
        
        <p className="text-center mt-6 text-xs text-muted-foreground font-medium">
          © 2026 GPRAGAS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}