"use client"

import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { ChevronRight, Clock } from "lucide-react"
import Image from "next/image"

export function TiposTratamentoScreen() {
  const { tiposTratamento, navigate } = useApp()

  const categorias = Array.from(new Set(tiposTratamento.map((t) => t.categoria)))

  return (
    <MobileShell title="Tipos de Tratamentos">
      <div className="px-4 md:px-8 lg:px-10 py-6 lg:py-8 max-w-5xl flex flex-col gap-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Conheca os principais tipos de tratamentos proteticos e procedimentos disponiveis.
        </p>

        {categorias.map((cat) => (
          <div key={cat} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {cat}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposTratamento
              .filter((t) => t.categoria === cat)
              .map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => navigate("tipo-tratamento-detalhe", { id: tipo.id })}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all text-left"
                >
                  {/* Image */}
                  <div className="relative w-full h-40 bg-muted">
                    <Image
                      src={tipo.imagens[0]}
                      alt={tipo.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Info */}
                  <div className="p-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{tipo.nome}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{tipo.duracao}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  )
}
