"use client"

import { useApp, type Paciente } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  ClipboardList,
  CheckCircle2,
  BookOpen,
  FileText,
  LogOut,
  Clock,
  Star,
  User,
} from "lucide-react"

export function PacienteHome() {
  const { currentUser, navigate, setRole, setCurrentUser, tratamentos } = useApp()
  const paciente = currentUser as Paciente

  const meusTratamentos = tratamentos.filter((t) => t.pacienteId === paciente.id)
  const emAndamento = meusTratamentos.filter((t) => t.status === "em_andamento").length
  const finalizados = meusTratamentos.filter((t) => t.status === "finalizado").length

  const handleLogout = () => {
    setRole(null as never)
    setCurrentUser(null)
    navigate("login")
  }

  return (
    <MobileShell
      title="Inicio"
      showBack={false}
      rightAction={
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          aria-label="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      }
    >
      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo(a)</p>
            <h2 className="text-lg font-semibold text-foreground">{paciente.nome}</h2>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Em andamento</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{emAndamento}</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Finalizados</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{finalizados}</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </h3>

          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "em_andamento" })}
            className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Tratamentos em andamento</p>
              <p className="text-xs text-muted-foreground mt-0.5">Acompanhe seus tratamentos atuais</p>
            </div>
          </button>

          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "finalizado" })}
            className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Tratamentos finalizados</p>
              <p className="text-xs text-muted-foreground mt-0.5">Historico de tratamentos concluidos</p>
            </div>
          </button>

          <button
            onClick={() => navigate("paciente-tratamentos", { filtro: "recomendacao" })}
            className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-chart-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Recomendacoes</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tratamentos recomendados pelo dentista</p>
            </div>
          </button>

          <button
            onClick={() => navigate("tipos-tratamento")}
            className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-chart-3" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Tipos de tratamentos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Conheca os procedimentos disponiveis</p>
            </div>
          </button>

          <button
            onClick={() => navigate("paciente-anamnese")}
            className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Minha anamnese</p>
              <p className="text-xs text-muted-foreground mt-0.5">Visualize seus dados de saude</p>
            </div>
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
