"use client"

import { useApp } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { AlertCircle, Pill, Heart, Users, Cigarette, MessageCircle, FileText, Calendar, User } from "lucide-react"

export function DentistaAnamneseView() {
  const { screenParams, anamneses, pacientes, dentistas } = useApp()
  const pacienteId = screenParams.pacienteId

  const anamnese = anamneses.find((a) => a.pacienteId === pacienteId)
  const paciente = pacientes.find((p) => p.id === pacienteId)

  if (!anamnese || !paciente) {
    return (
      <MobileShell title="Anamnese">
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <FileText className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Anamnese nao encontrada
          </p>
        </div>
      </MobileShell>
    )
  }

  const dentista = dentistas.find((d) => d.id === anamnese.dentistaId)

  const campos = [
    { icon: AlertCircle, label: "Alergias", value: anamnese.alergias, color: "text-destructive bg-destructive/10" },
    { icon: Pill, label: "Medicamentos em uso", value: anamnese.medicamentos, color: "text-primary bg-primary/10" },
    { icon: Heart, label: "Doencas pre-existentes", value: anamnese.doencasPreExistentes, color: "text-accent bg-accent/10" },
    { icon: Users, label: "Historico familiar", value: anamnese.historicoFamiliar, color: "text-chart-4 bg-chart-4/10" },
    { icon: Cigarette, label: "Habitos", value: anamnese.habitos, color: "text-chart-5 bg-chart-5/10" },
    { icon: MessageCircle, label: "Queixa principal", value: anamnese.queixaPrincipal, color: "text-primary bg-primary/10" },
  ]

  return (
    <MobileShell title="Anamnese">
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Patient */}
        <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paciente</p>
            <p className="text-sm font-semibold text-foreground">{paciente.nome}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data da anamnese</p>
            <p className="text-sm font-semibold text-foreground">
              {new Date(anamnese.data).toLocaleDateString("pt-BR")}
            </p>
            {dentista && <p className="text-xs text-muted-foreground">{dentista.nome}</p>}
          </div>
        </div>

        {campos.map((campo, i) => {
          const Icon = campo.icon
          return (
            <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${campo.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{campo.label}</h4>
              </div>
              <p className="text-sm text-foreground">{campo.value}</p>
            </div>
          )
        })}

        {anamnese.observacoes && (
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Observacoes</h4>
            </div>
            <p className="text-sm text-foreground">{anamnese.observacoes}</p>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
