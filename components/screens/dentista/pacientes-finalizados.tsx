"use client"

import { useApp, type Dentista } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { ChevronRight, User, CheckCircle2 } from "lucide-react"

export function DentistaPacientesFinalizados() {
  const { currentUser, tratamentos, pacientes, navigate } = useApp()
  const dentista = currentUser as Dentista

  const meusTratamentos = tratamentos.filter((t) => t.dentistaId === dentista.id)

  // Find patients where ALL their treatments with this dentist are "finalizado"
  const pacienteIds = Array.from(new Set(meusTratamentos.map((t) => t.pacienteId)))
  const pacientesFinalizados = pacienteIds.filter((pacienteId) => {
    const trats = meusTratamentos.filter((t) => t.pacienteId === pacienteId)
    return trats.length > 0 && trats.every((t) => t.status === "finalizado")
  })

  return (
    <MobileShell title="Pacientes Finalizados">
      <div className="px-4 py-5 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pacientes com todos os tratamentos concluidos.
        </p>

        {pacientesFinalizados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Nenhum paciente com todos os tratamentos finalizados
            </p>
          </div>
        )}

        {pacientesFinalizados.map((pacienteId) => {
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
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{paciente.nome}</p>
                  <p className="text-xs text-muted-foreground">{paciente.cpf}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Finalizado
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>

              {/* Treatments */}
              <div className="border-t border-border">
                {pacienteTratamentos.map((tratamento, i) => (
                  <button
                    key={tratamento.id}
                    onClick={() => navigate("dentista-tratamento-detalhe", { id: tratamento.id })}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-muted/50 transition-colors ${
                      i < pacienteTratamentos.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{tratamento.tipo}</p>
                    </div>
                    {tratamento.dataFim && (
                      <span className="text-[10px] text-muted-foreground">
                        {tratamento.dataFim}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </MobileShell>
  )
}
