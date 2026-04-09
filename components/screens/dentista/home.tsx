"use client"

import { useApp, type Dentista } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  Users,
  FileText,
  ClipboardList,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  User,
  Plus,
  ArrowRight,
} from "lucide-react"

export function DentistaHome() {
  const { currentUser, navigate, tratamentos, pacientes } = useApp()
  const dentista = currentUser as Dentista

  const meusTratamentos = tratamentos.filter((t) => t.dentistaId === dentista.id)
  const emAndamento = meusTratamentos.filter((t) => t.status === "em_andamento").length
  const finalizados = meusTratamentos.filter((t) => t.status === "finalizado").length
  const meusPackientesIds = new Set(meusTratamentos.map((t) => t.pacienteId))
  const totalPacientes = meusPackientesIds.size

  return (
    <MobileShell title="Início" showBack={false}>
      <div className="px-4 md:px-8 lg:px-10 py-6 lg:py-8 max-w-5xl">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-8 animate-in">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo(a)</p>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">{dentista.nome}</h2>
            <p className="text-xs text-muted-foreground">{dentista.cro}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-10 animate-in stagger-1">
          <div className="bg-card rounded-xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide">Pacientes</span>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-foreground">{totalPacientes}</p>
          </div>
          <div className="bg-card rounded-xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide">Andamento</span>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-foreground">{emAndamento}</p>
          </div>
          <div className="bg-card rounded-xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide">Finalizados</span>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-foreground">{finalizados}</p>
          </div>
        </div>

        {/* Menu grid */}
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 animate-in stagger-2">
          Gerenciamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <button
            onClick={() => navigate("dentista-pacientes")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-3"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Pacientes</p>
              <p className="text-xs text-muted-foreground mt-0.5">Gerencie a lista de pacientes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("dentista-anamnese-nova")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-3"
          >
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Anamnese novo paciente</p>
              <p className="text-xs text-muted-foreground mt-0.5">Registre uma nova anamnese</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("dentista-tratamentos", { filtro: "em_andamento" })}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-4"
          >
            <div className="w-11 h-11 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-chart-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Tratamentos em andamento</p>
              <p className="text-xs text-muted-foreground mt-0.5">Acompanhe tratamentos ativos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-chart-4 transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("dentista-pacientes-finalizados")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-4"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Pacientes finalizados</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes com tratamento concluído</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("dentista-pacientes-tratamentos")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-5"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Pacientes em tratamento</p>
              <p className="text-xs text-muted-foreground mt-0.5">Relação paciente e tratamento</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("tipos-tratamento")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-5"
          >
            <div className="w-11 h-11 rounded-lg bg-chart-5/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-chart-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Tipos de tratamentos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Catálogo de procedimentos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-chart-5 transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("dentista-tratamentos", { filtro: "recomendacao" })}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-6"
          >
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Recomendações</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tratamentos recomendados</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
