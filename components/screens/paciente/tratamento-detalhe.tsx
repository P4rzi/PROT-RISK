"use client"

import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  Calendar,
  User,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  em_andamento: { label: "Em andamento", color: "text-primary", bg: "bg-primary/10" },
  finalizado: { label: "Finalizado", color: "text-accent", bg: "bg-accent/10" },
  recomendacao: { label: "Recomendacao", color: "text-chart-4", bg: "bg-chart-4/10" },
}

export function PacienteTratamentoDetalhe() {
  const { screenParams, tratamentos, dentistas } = useApp()
  const tratamento = tratamentos.find((t) => t.id === screenParams.id)

  if (!tratamento) {
    return (
      <MobileShell title="Detalhe">
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Tratamento nao encontrado</p>
        </div>
      </MobileShell>
    )
  }

  const dentista = dentistas.find((d) => d.id === tratamento.dentistaId)
  const config = statusConfig[tratamento.status]

  return (
    <MobileShell title="Detalhe do Tratamento">
      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Header card */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">{tratamento.tipo}</h2>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color} ${config.bg}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tratamento.descricao}</p>
        </div>

        {/* Info cards */}
        <div className="flex flex-col gap-3">
          {dentista && (
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dentista responsavel</p>
                <p className="text-sm font-semibold text-foreground">{dentista.nome}</p>
                <p className="text-xs text-muted-foreground">{dentista.especialidade}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Inicio</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {new Date(tratamento.dataInicio).toLocaleDateString("pt-BR")}
              </p>
            </div>
            {tratamento.dataFim ? (
              <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Fim</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(tratamento.dataFim).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ) : tratamento.proximaConsulta ? (
              <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-chart-4" />
                  <span className="text-xs text-muted-foreground">Proxima</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(tratamento.proximaConsulta).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Procedures */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Procedimentos</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {tratamento.procedimentos.map((proc, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground">{proc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {tratamento.observacoes && (
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Observacoes</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tratamento.observacoes}</p>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
