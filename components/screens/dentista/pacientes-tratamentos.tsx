"use client"

import { useApp, type Dentista } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { ChevronRight, User, Clock, CheckCircle2, Star } from "lucide-react"

const statusConfig: Record<string, { icon: typeof Clock; color: string }> = {
  em_andamento: { icon: Clock, color: "text-primary" },
  finalizado: { icon: CheckCircle2, color: "text-accent" },
  recomendacao: { icon: Star, color: "text-chart-4" },
}

export function DentistaPacientesTratamentos() {
  const { currentUser, tratamentos, pacientes, navigate } = useApp()
  const dentista = currentUser as Dentista

  const meusTratamentos = tratamentos.filter((t) => t.dentistaId === dentista.id)
  const pacienteIds = Array.from(new Set(meusTratamentos.map((t) => t.pacienteId)))

  return (
    <MobileShell title="Pacientes em Tratamento">
      <div className="px-4 py-5 flex flex-col gap-4">
        {pacienteIds.map((pacienteId) => {
          const paciente = pacientes.find((p) => p.id === pacienteId)
          if (!paciente) return null
          const pacienteTratamentos = meusTratamentos.filter((t) => t.pacienteId === pacienteId)

          return (
            <div key={pacienteId} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Patient header */}
              <button
                onClick={() => navigate("dentista-paciente-detalhe", { id: pacienteId })}
                className="flex items-center gap-3 p-4 w-full text-left hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{paciente.nome}</p>
                  <p className="text-xs text-muted-foreground">{paciente.cpf}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>

              {/* Treatments */}
              <div className="border-t border-border">
                {pacienteTratamentos.map((tratamento, i) => {
                  const config = statusConfig[tratamento.status]
                  const Icon = config.icon
                  return (
                    <button
                      key={tratamento.id}
                      onClick={() => navigate("dentista-tratamento-detalhe", { id: tratamento.id })}
                      className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-muted/50 transition-colors ${
                        i < pacienteTratamentos.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{tratamento.tipo}</p>
                      </div>
                      <span className={`text-[10px] font-medium ${config.color}`}>
                        {tratamento.status === "em_andamento"
                          ? "Andamento"
                          : tratamento.status === "finalizado"
                          ? "Finalizado"
                          : "Recomendacao"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </MobileShell>
  )
}
