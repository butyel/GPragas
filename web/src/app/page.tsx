"use client";

import Link from "next/link";
import { Bug, Calendar, Shield, Cpu, Clock, Sparkles, ChevronRight, Play, CheckCircle2, Search, Users, BarChart3 } from "lucide-react";

const Button = ({ children, className, variant = "primary", ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-all duration-200";
  const variants: any = {
    primary: "bg-primary text-white hover:bg-primary-dark glow-blue",
    outline: "glass-card border-white/20 hover:bg-white/5",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Background Textures */}
      <div className="fixed inset-0 bg-premium-gradient -z-20" />
      <div className="fixed inset-0 bg-vertical-lines -z-10" />
      <div className="fixed inset-0 bg-grid-pattern opacity-20 -z-10" />

      {/* Glow Orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-blue-600/20 top-[-100px] left-[-100px]" />
      <div className="glow-orb w-[600px] h-[600px] bg-cyan-600/10 bottom-[-200px] right-[-100px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between glass-panel border-b-0 mt-4 rounded-2xl max-w-7xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Cpu className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-glow">GPRAGAS<span className="text-primary italic">.ai</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">Home</Link>
          <Link href="#" className="hover:text-primary transition-colors">Soluções</Link>
          <Link href="#" className="hover:text-primary transition-colors">Tecnologia</Link>
          <Link href="#" className="hover:text-primary transition-colors">Planos</Link>
          <Link href="#" className="hover:text-primary transition-colors">Suporte</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Entrar</Link>
          <Button className="px-6 py-2.5 text-sm">
            Falar com Especialista
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <section className="relative text-center max-w-4xl mx-auto mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary mb-8 animate-float">
            <Sparkles className="h-3 w-3" />
            <span>Líder em Gestão Inteligente de Pragas</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-glow leading-[1.1]">
            O Futuro do Controle <br /> 
            <span className="text-primary italic">Está na Inteligência</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed italic">
            Potencialize suas operações de dedetização com tecnologia de ponta, relatórios automatizados e insights baseados em IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="px-10 h-14 text-lg">
              Começar Agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="px-10 h-14 text-lg">
              <Play className="mr-2 h-5 w-5 fill-current" />
              Ver Demonstração
            </Button>
          </div>

          {/* Decorative Floating Tags */}
          <div className="absolute -left-10 top-0 glass-card px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-white/40 border-white/5 -rotate-12 animate-float" style={{ animationDelay: '0.5s' }}>
            SMART MONITORING
          </div>
          <div className="absolute left-0 bottom-20 glass-card px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-white/40 border-white/5 rotate-12 animate-float" style={{ animationDelay: '1.5s' }}>
            AUTOMATED REPORTS
          </div>
          <div className="absolute right-10 top-20 glass-card px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-white/40 border-white/5 rotate-6 animate-float" style={{ animationDelay: '2s' }}>
            PREDICTIVE ANALYTICS
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-40">
          <div className="text-center mb-16">
            <div className="bg-primary/10 text-primary w-fit px-4 py-1 rounded-full text-[10px] font-bold mx-auto mb-4 border border-primary/20 uppercase tracking-widest">
              Nossa Tecnologia
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow italic">
              Operações 100% Digitalizadas <br /> e Otimizadas por IA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Segurança Total", desc: "Monitoramento em tempo real e conformidade total com normas sanitárias." },
              { icon: Search, title: "Detecção Inteligente", desc: "Algoritmos que identificam padrões e prevêem infestações." },
              { icon: BarChart3, title: "Analytics Pro", desc: "Dashboards detalhados com lucratividade e performance de campo." },
              { icon: Clock, title: "Agendador Smart", desc: "Otimização automática de rotas para reduzir custos logísticos." }
            ].map((feature, i) => (
              <div key={i} className="glass-card group hover:border-primary/50 transition-all p-8 rounded-3xl text-left relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                  <feature.icon className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {feature.desc}
                </p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-48 glass-panel p-12 rounded-[3rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bug className="w-64 h-64 -rotate-12" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-glow">
                Resultados <span className="text-primary italic">Comprovados</span> No Campo
              </h2>
              <p className="text-muted-foreground mb-8 text-lg italic">
                Aumente a eficiência operacional em até 35% e reduza o uso de papel em 100% com a GPRAGAS.
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-black text-white italic">+100k</div>
                  <div className="text-sm text-muted-foreground font-medium">Ordens de Serviço</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-4xl font-black text-white italic">99.9%</div>
                  <div className="text-sm text-muted-foreground font-medium">Uptime Sistema</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu className="text-primary h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">GPRAGAS<span className="text-primary italic">.ai</span></span>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">
            © 2026 GPRAGAS INTELLIGENT SYSTEMS. TODOS OS DIREITOS RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
}