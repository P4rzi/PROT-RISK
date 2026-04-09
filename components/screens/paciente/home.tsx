"use client"

import { useApp, type Paciente } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  ClipboardList,
  CheckCircle2,
  BookOpen,
  FileText,
  Clock,
  Star,
  User,
  ArrowRight,
} from "lucide-react"

export function PacienteHome() {
  const { currentUser, navigate, tratamentos } = useApp()
  const paciente = currentUser as Paciente

  const meusTratamentos = tratamentos.filter((t) => t.pacienteId === paciente.id)
  const emAndamento = meusTratamentos.filter((t) => t.status === "em_andamento").length
  const finalizados = meusTratamentos.filter((t) => t.status === "finalizado").length

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
            <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">{paciente.nome}</h2>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 mb-10 animate-in stagger-1">
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Em andamento</span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{emAndamento}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Finalizados</span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{finalizados}</p>
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "em_andamento" })}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-2"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Tratamentos em andamento</p>
              <p className="text-xs text-muted-foreground mt-0.5">Acompanhe seus tratamentos atuais</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "finalizado" })}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-3"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Tratamentos finalizados</p>
              <p className="text-xs text-muted-foreground mt-0.5">Histórico de tratamentos concluídos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "recomendacao" })}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-4"
          >
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Recomendações</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tratamentos recomendados pelo dentista</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0" />
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
              <p className="text-xs text-muted-foreground mt-0.5">Conheça os procedimentos disponíveis</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-chart-5 transition-colors flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate("paciente-anamnese")}
            className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-left animate-in stagger-6"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Minha anamnese</p>
              <p className="text-xs text-muted-foreground mt-0.5">Visualize seus dados de saúde</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
