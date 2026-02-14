"use client"

import { useState } from "react"
import { useApp, type Dentista, type Anamnese } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { CheckCircle2 } from "lucide-react"

export function DentistaAnamneseForm() {
  const { screenParams, currentUser, pacientes, addAnamnese, navigate } = useApp()
  const dentista = currentUser as Dentista
  const pacienteId = screenParams.pacienteId || ""

  const [selectedPaciente, setSelectedPaciente] = useState(pacienteId)
  const [alergias, setAlergias] = useState("")
  const [medicamentos, setMedicamentos] = useState("")
  const [doencas, setDoencas] = useState("")
  const [historico, setHistorico] = useState("")
  const [habitos, setHabitos] = useState("")
  const [queixa, setQueixa] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = () => {
    if (!selectedPaciente || !queixa) return

    const novaAnamnese: Anamnese = {
      id: Date.now().toString(),
      pacienteId: selectedPaciente,
      dentistaId: dentista.id,
      data: new Date().toISOString().split("T")[0],
      alergias: alergias || "Nenhuma",
      medicamentos: medicamentos || "Nenhum",
      doencasPreExistentes: doencas || "Nenhuma",
      historicoFamiliar: historico || "Sem historico relevante",
      habitos: habitos || "Nenhum relevante",
      queixaPrincipal: queixa,
      observacoes,
    }

    addAnamnese(novaAnamnese)
    setSuccess(true)
    setTimeout(() => {
      navigate("dentista-home")
    }, 1500)
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
      </div>
    </MobileShell>
  )
}
