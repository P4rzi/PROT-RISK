"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

export function TipoTratamentoDetalheScreen() {
  const { screenParams, tiposTratamento } = useApp()
  const tipo = tiposTratamento.find((t) => t.id === screenParams.id)
  const [currentImage, setCurrentImage] = useState(0)

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

  const imagens = tipo.imagens
  const totalImages = imagens.length

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % totalImages)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages)
  }

  return (
    <MobileShell title={tipo.nome}>
      <div className="flex flex-col gap-5 pb-6">
        {/* Image Carousel */}
        <div className="relative w-full h-56 bg-muted">
          <Image
            src={imagens[currentImage]}
            alt={`${tipo.nome} - foto ${currentImage + 1}`}
            fill
            className="object-cover"
          />
          {totalImages > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/40 flex items-center justify-center text-primary-foreground hover:bg-foreground/60 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/40 flex items-center justify-center text-primary-foreground hover:bg-foreground/60 transition-colors"
                aria-label="Proxima foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImage ? "bg-primary-foreground" : "bg-primary-foreground/40"
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          {/* Counter */}
          <div className="absolute top-3 right-3 bg-foreground/50 text-primary-foreground text-[10px] font-medium px-2 py-1 rounded-full">
            {currentImage + 1}/{totalImages}
          </div>
        </div>

        <div className="px-4 flex flex-col gap-5">
          {/* Header info */}
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-1">{tipo.nome}</h2>
            <span className="inline-block text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mb-3">
              {tipo.categoria}
            </span>
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
      </div>
    </MobileShell>
  )
}
