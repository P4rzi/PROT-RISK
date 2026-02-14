"use client"

import { useApp, type Dentista } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  User,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  AlertCircle,
} from "lucide-react"

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  em_andamento: { label: "Em andamento", icon: Clock, color: "text-primary bg-primary/10" },
  finalizado: { label: "Finalizado", icon: CheckCircle2, color: "text-accent bg-accent/10" },
  recomendacao: { label: "Recomendacao", icon: Star, color: "text-chart-4 bg-chart-4/10" },
}

export function DentistaPacienteDetalhe() {
  const { screenParams, pacientes, tratamentos, anamneses, navigate, currentUser } = useApp()
  const dentista = currentUser as Dentista
  const paciente = pacientes.find((p) => p.id === screenParams.id)

  if (!paciente) {
    return (
      <MobileShell title="Paciente">
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Paciente nao encontrado</p>
        </div>
      </MobileShell>
    )
  }

  const pacienteTratamentos = tratamentos.filter(
    (t) => t.pacienteId === paciente.id && t.dentistaId === dentista.id
  )
  const pacienteAnamnese = anamneses.find((a) => a.pacienteId === paciente.id)

  return (
    <MobileShell title={paciente.nome}>
      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Patient info card */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{paciente.nome}</h2>
              <p className="text-xs text-muted-foreground">{paciente.cpf}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{paciente.telefone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{paciente.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        {/* Anamnese */}
        <button
          onClick={() =>
            pacienteAnamnese
              ? navigate("dentista-anamnese-view", { pacienteId: paciente.id })
              : navigate("dentista-anamnese-nova", { pacienteId: paciente.id })
          }
          className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Anamnese</p>
            <p className="text-xs text-muted-foreground">
              {pacienteAnamnese ? "Visualizar anamnese" : "Registrar anamnese"}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Treatments */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Tratamentos
            </h3>
            <button
              onClick={() => navigate("dentista-novo-tratamento", { pacienteId: paciente.id })}
              className="text-xs font-medium text-primary"
            >
              + Novo tratamento
            </button>
          </div>

          {pacienteTratamentos.length === 0 ? (
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <p className="text-sm text-muted-foreground">Nenhum tratamento registrado</p>
            </div>
          ) : (
            pacienteTratamentos.map((tratamento) => {
              const config = statusConfig[tratamento.status]
              const Icon = config.icon
              return (
                <button
                  key={tratamento.id}
                  onClick={() => navigate("dentista-tratamento-detalhe", { id: tratamento.id })}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{tratamento.tipo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{config.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              )
            })
          )}
        </div>
      </div>
    </MobileShell>
  )
}
