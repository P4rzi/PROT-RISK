"use client"

import { useApp, type Paciente } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { Clock, CheckCircle2, Star, ChevronRight, SearchX } from "lucide-react"

const statusLabels: Record<string, string> = {
  em_andamento: "Em andamento",
  finalizado: "Finalizados",
  recomendacao: "Recomendacoes",
}

const statusIcons: Record<string, typeof Clock> = {
  em_andamento: Clock,
  finalizado: CheckCircle2,
  recomendacao: Star,
}

const statusColors: Record<string, string> = {
  em_andamento: "text-primary bg-primary/10",
  finalizado: "text-accent bg-accent/10",
  recomendacao: "text-chart-4 bg-chart-4/10",
}

export function PacienteTratamentosLista() {
  const { screenParams, currentUser, tratamentos, navigate, dentistas } = useApp()
  const paciente = currentUser as Paciente
  const filtro = screenParams.filtro || "em_andamento"

  const meusTratamentos = tratamentos.filter(
    (t) => t.pacienteId === paciente.id && t.status === filtro
  )

  const Icon = statusIcons[filtro] || Clock
  const title = statusLabels[filtro] || "Tratamentos"

  return (
    <MobileShell title={title}>
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.entries(statusLabels).map(([key, label]) => {
            const ChipIcon = statusIcons[key]
            return (
              <button
                key={key}
                onClick={() => navigate("paciente-tratamentos", { filtro: key })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  filtro === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                <ChipIcon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>

        {/* List */}
        {meusTratamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <SearchX className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Nenhum tratamento encontrado
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {meusTratamentos.map((tratamento) => {
              const dentista = dentistas.find((d) => d.id === tratamento.dentistaId)
              const colorClasses = statusColors[tratamento.status]
              return (
                <button
                  key={tratamento.id}
                  onClick={() => navigate("paciente-tratamento-detalhe", { id: tratamento.id })}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{tratamento.tipo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{tratamento.descricao}</p>
                    {dentista && (
                      <p className="text-xs text-muted-foreground mt-0.5">{dentista.nome}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </MobileShell>
  )
}
