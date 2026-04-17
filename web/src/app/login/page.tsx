"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Scissors, Loader2, Sparkles, ChevronRight, Users } from "lucide-react";

const Input = ({ ...props }: any) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 focus:border-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
  />
);

const Button = ({ children, loading, ...props }: any) => (
  <button
    {...props}
    className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary-dark shadow-glow transition-all text-white flex items-center justify-center disabled:opacity-50"
  >
    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : children}
  </button>
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden text-foreground">
      {/* Background Textures */}
      <div className="fixed inset-0 bg-premium-gradient -z-20" />
      <div className="fixed inset-0 bg-vertical-lines -z-10" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 -z-10" />
      
      {/* Glow Orbs */}
      <div className="glow-orb w-[400px] h-[400px] bg-primary/20 top-[10%] left-[-100px]" />
      <div className="glow-orb w-[400px] h-[400px] bg-cyan-600/10 bottom-[10%] right-[-100px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6 shadow-glow animate-float group-hover:scale-110 transition-transform">
            <Cpu className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white text-glow mb-2">GPRAGAS<span className="text-primary italic">.ai</span></h1>
          <p className="text-muted-foreground font-medium italic">Elite Pest Control Management</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden">
          {/* Inner Glow Decorative */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1 text-white">Bem-vindo</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Entre para gerenciar sua operação <Sparkles className="h-3.5 w-3.5 text-primary" />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 text-white/80">E-mail Corporativo</label>
              <Input type="email" placeholder="nome@suaempresa.com" required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-white/80">Senha</label>
                <a href="#" className="text-[11px] text-primary/80 hover:text-primary transition-colors font-bold uppercase tracking-wider">Esqueceu?</a>
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" loading={loading}>
              Acessar Sistema
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
            <div className="text-xs">
              <span className="text-muted-foreground">Nova Empresa? </span>
              <a href="#" className="text-primary hover:text-primary-light transition-colors font-bold group">
                Contratar Plano Pro
                <ChevronRight className="inline-block h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            
            <a href="#" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
              <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white/90">Acesso Colaborador</span>
            </a>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          Powered by GPRAGAS Intelligence
        </p>
      </div>
    </div>
  );
}
