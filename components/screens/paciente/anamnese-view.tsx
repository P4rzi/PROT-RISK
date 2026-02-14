"use client"

import { useApp, type Paciente } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { AlertCircle, Pill, Heart, Users, Cigarette, MessageCircle, FileText, Calendar } from "lucide-react"

export function PacienteAnamneseView() {
  const { currentUser, anamneses, dentistas } = useApp()
  const paciente = currentUser as Paciente

  const minhaAnamnese = anamneses.find((a) => a.pacienteId === paciente.id)

  if (!minhaAnamnese) {
    return (
      <MobileShell title="Minha Anamnese">
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <FileText className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Nenhuma anamnese registrada. Ela sera preenchida pelo seu dentista na proxima consulta.
          </p>
        </div>
      </MobileShell>
    )
  }

  const dentista = dentistas.find((d) => d.id === minhaAnamnese.dentistaId)

  const campos = [
    { icon: AlertCircle, label: "Alergias", value: minhaAnamnese.alergias, color: "text-destructive bg-destructive/10" },
    { icon: Pill, label: "Medicamentos em uso", value: minhaAnamnese.medicamentos, color: "text-primary bg-primary/10" },
    { icon: Heart, label: "Doencas pre-existentes", value: minhaAnamnese.doencasPreExistentes, color: "text-accent bg-accent/10" },
    { icon: Users, label: "Historico familiar", value: minhaAnamnese.historicoFamiliar, color: "text-chart-4 bg-chart-4/10" },
    { icon: Cigarette, label: "Habitos", value: minhaAnamnese.habitos, color: "text-chart-5 bg-chart-5/10" },
    { icon: MessageCircle, label: "Queixa principal", value: minhaAnamnese.queixaPrincipal, color: "text-primary bg-primary/10" },
  ]

  return (
    <MobileShell title="Minha Anamnese">
      <div className="px-4 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data da anamnese</p>
            <p className="text-sm font-semibold text-foreground">
              {new Date(minhaAnamnese.data).toLocaleDateString("pt-BR")}
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

        {minhaAnamnese.observacoes && (
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Observacoes</h4>
            </div>
            <p className="text-sm text-foreground">{minhaAnamnese.observacoes}</p>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
