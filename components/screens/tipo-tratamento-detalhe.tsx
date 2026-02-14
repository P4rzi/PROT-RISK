"use client"

import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Stethoscope,
} from "lucide-react"

export function TipoTratamentoDetalheScreen() {
  const { screenParams, tiposTratamento } = useApp()
  const tipo = tiposTratamento.find((t) => t.id === screenParams.id)

  if (!tipo) {
    return (
      <MobileShell title="Detalhe">
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Tipo de tratamento nao encontrado</p>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell title={tipo.nome}>
      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Header */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{tipo.nome}</h2>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {tipo.categoria}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tipo.descricao}</p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Duracao estimada</p>
            <p className="text-sm font-semibold text-foreground">{tipo.duracao}</p>
          </div>
        </div>

        {/* Indications */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">Indicacoes</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tipo.indicacoes}</p>
        </div>

        {/* Contraindications */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">Contraindicacoes</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tipo.contraindicacoes}</p>
        </div>

        {/* Info */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              As informacoes apresentadas sao para fins educativos. Consulte seu dentista para uma avaliacao personalizada e indicacao do melhor tratamento para o seu caso.
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  )
}
