"use client"

import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { ChevronRight, Stethoscope } from "lucide-react"

const categoryColors: Record<string, string> = {
  "Protese Removivel": "bg-primary/10 text-primary",
  "Protese Fixa": "bg-accent/10 text-accent",
  "Implantodontia": "bg-chart-4/10 text-chart-4",
  "Estetica": "bg-chart-5/10 text-chart-5",
}

export function TiposTratamentoScreen() {
  const { tiposTratamento, navigate } = useApp()

  const categorias = Array.from(new Set(tiposTratamento.map((t) => t.categoria)))

  return (
    <MobileShell title="Tipos de Tratamentos">
      <div className="px-4 py-5 flex flex-col gap-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Conheca os principais tipos de tratamentos proteticos e procedimentos disponiveis.
        </p>

        {categorias.map((cat) => (
          <div key={cat} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {cat}
            </h3>
            {tiposTratamento
              .filter((t) => t.categoria === cat)
              .map((tipo) => {
                const colorClass = categoryColors[cat] || "bg-primary/10 text-primary"
                return (
                  <button
                    key={tipo.id}
                    onClick={() => navigate("tipo-tratamento-detalhe", { id: tipo.id })}
                    className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{tipo.nome}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Duracao: {tipo.duracao}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </MobileShell>
  )
}
