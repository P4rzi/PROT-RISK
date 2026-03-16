"use client"

import { useState } from "react"
import { useApp, type Dentista, type Anamnese } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { MobileShell } from "@/components/mobile-shell"
import { CheckCircle2 } from "lucide-react"

const RISCOS_COMUNS = [
  "Diabetes",
  "Osteoporose",
  "Pressao alta (Hipertensao)",
  "Problemas cardiacos",
  "Asma",
  "Hepatite",
  "HIV/AIDS",
  "Anemia",
  "Disturbios de coagulacao",
  "Epilepsia",
  "Doencas renais",
  "Doencas na tireoide",
  "Artrite reumatoide",
  "Cancer (em tratamento)",
  "Alergia a anestesicos",
  "Gravidez / Lactante",
]

export function DentistaAnamneseForm() {
  const { screenParams, currentUser, pacientes, addAnamnese, navigate } = useApp()
  const dentista = currentUser as Dentista
  const pacienteId = screenParams.pacienteId || ""

  const [selectedPaciente, setSelectedPaciente] = useState(pacienteId)
  const [alergias, setAlergias] = useState("")
  const [medicamentos, setMedicamentos] = useState("")
  const [doencas, setDoencas] = useState("")
  const [riscosSelecionados, setRiscosSelecionados] = useState<string[]>([])
  const [historico, setHistorico] = useState("")
  const [habitos, setHabitos] = useState("")
  const [queixa, setQueixa] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const toggleRisco = (risco: string) => {
    setRiscosSelecionados((prev) =>
      prev.includes(risco) ? prev.filter((r) => r !== risco) : [...prev, risco]
    )
  }

  const handleSubmit = async () => {
    if (!selectedPaciente || !queixa) return
    setError("")

    const novaAnamnese: Anamnese = {
      id: Date.now().toString(),
      pacienteId: selectedPaciente,
      dentistaId: dentista.id,
      data: new Date().toISOString().split("T")[0],
      alergias: alergias || "Nenhuma",
      medicamentos: medicamentos || "Nenhum",
      doencasPreExistentes: doencas || "Nenhuma",
      riscos: riscosSelecionados,
      historicoFamiliar: historico || "Sem historico relevante",
      habitos: habitos || "Nenhum relevante",
      queixaPrincipal: queixa,
      observacoes,
    }

    try {
      await addAnamnese(novaAnamnese)
      toast({
        title: "Anamnese salva",
        description: "Anamnese registrada com sucesso.",
      })
      setSuccess(true)
      setTimeout(() => {
        navigate("dentista-home")
      }, 1500)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao salvar anamnese"
      setError(message)
      toast({
        title: "Erro ao salvar anamnese",
        description: message,
        variant: "destructive",
      })
    }
  }

  if (success) {
    return (
      <MobileShell title="Anamnese">
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Anamnese registrada!</h2>
          <p className="text-sm text-muted-foreground text-center">
            A anamnese foi salva com sucesso.
          </p>
        </div>
      </MobileShell>
    )
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"

  return (
    <MobileShell title="Nova Anamnese">
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Select patient */}
        {!pacienteId && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Paciente</label>
            <select
              value={selectedPaciente}
              onChange={(e) => setSelectedPaciente(e.target.value)}
              className={inputClasses}
            >
              <option value="">Selecione o paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} - {p.cpf}
                </option>
              ))}
            </select>
          </div>
        )}

        {pacienteId && (
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-xs text-muted-foreground">Paciente</p>
            <p className="text-sm font-semibold text-foreground">
              {pacientes.find((p) => p.id === pacienteId)?.nome}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Queixa principal *</label>
          <textarea
            placeholder="Descreva a queixa principal do paciente"
            value={queixa}
            onChange={(e) => setQueixa(e.target.value)}
            rows={3}
            className={inputClasses + " resize-none"}
          />
        </div>

        {/* Risk checkboxes section */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fatores de risco
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Marque as condicoes que o paciente possui
          </p>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="grid grid-cols-1 gap-2.5">
              {RISCOS_COMUNS.map((risco) => {
                const isChecked = riscosSelecionados.includes(risco)
                return (
                  <label
                    key={risco}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-destructive/5 border border-destructive/20"
                        : "bg-muted/30 border border-transparent hover:bg-muted/60"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRisco(risco)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                          isChecked
                            ? "bg-destructive border-destructive"
                            : "border-muted-foreground/30 bg-card"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-destructive-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm ${isChecked ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {risco}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
          {riscosSelecionados.length > 0 && (
            <p className="text-xs text-destructive mt-2 font-medium">
              {riscosSelecionados.length} fator(es) de risco selecionado(s)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Alergias</label>
          <input
            type="text"
            placeholder="Ex: Penicilina, Latex"
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Medicamentos em uso</label>
          <input
            type="text"
            placeholder="Ex: Anti-hipertensivo, Insulina"
            value={medicamentos}
            onChange={(e) => setMedicamentos(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Doencas pre-existentes</label>
          <input
            type="text"
            placeholder="Ex: Diabetes, Hipertensao"
            value={doencas}
            onChange={(e) => setDoencas(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Historico familiar</label>
          <input
            type="text"
            placeholder="Ex: Diabetes na familia"
            value={historico}
            onChange={(e) => setHistorico(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Habitos</label>
          <input
            type="text"
            placeholder="Ex: Fumante, Bruxismo"
            value={habitos}
            onChange={(e) => setHabitos(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Observacoes</label>
          <textarea
            placeholder="Observacoes adicionais"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className={inputClasses + " resize-none"}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedPaciente || !queixa}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Anamnese
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </MobileShell>
  )
}
