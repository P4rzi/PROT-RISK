"use client"

import { useState } from "react"
import { useApp, type Dentista, type Tratamento } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { CheckCircle2, Plus, X } from "lucide-react"

export function DentistaNovoTratamento() {
  const { screenParams, currentUser, pacientes, tiposTratamento, addTratamento, navigate } = useApp()
  const dentista = currentUser as Dentista
  const pacienteId = screenParams.pacienteId || ""

  const [selectedPaciente, setSelectedPaciente] = useState(pacienteId)
  const [tipo, setTipo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState<"em_andamento" | "recomendacao">("em_andamento")
  const [observacoes, setObservacoes] = useState("")
  const [procedimentos, setProcedimentos] = useState<string[]>([])
  const [novoProcedimento, setNovoProcedimento] = useState("")
  const [success, setSuccess] = useState(false)

  const addProcedimento = () => {
    if (novoProcedimento.trim()) {
      setProcedimentos((prev) => [...prev, novoProcedimento.trim()])
      setNovoProcedimento("")
    }
  }

  const removeProcedimento = (index: number) => {
    setProcedimentos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!selectedPaciente || !tipo || !descricao) return

    const novoTratamento: Tratamento = {
      id: Date.now().toString(),
      pacienteId: selectedPaciente,
      dentistaId: dentista.id,
      tipo,
      descricao,
      status,
      dataInicio: new Date().toISOString().split("T")[0],
      observacoes,
      procedimentos,
    }

    addTratamento(novoTratamento)
    setSuccess(true)
    setTimeout(() => {
      navigate("dentista-home")
    }, 1500)
  }

  if (success) {
    return (
      <MobileShell title="Novo Tratamento">
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Tratamento registrado!</h2>
          <p className="text-sm text-muted-foreground text-center">
            O tratamento foi salvo com sucesso.
          </p>
        </div>
      </MobileShell>
    )
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"

  return (
    <MobileShell title="Novo Tratamento">
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Select patient */}
        {!pacienteId && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Paciente *</label>
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
          <label className="block text-sm font-medium text-foreground mb-1.5">Tipo de tratamento *</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={inputClasses}
          >
            <option value="">Selecione o tipo</option>
            {tiposTratamento.map((t) => (
              <option key={t.id} value={t.nome}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Descricao *</label>
          <textarea
            placeholder="Descreva o tratamento"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className={inputClasses + " resize-none"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Status inicial</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("em_andamento")}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg border transition-colors ${
                status === "em_andamento"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              Em andamento
            </button>
            <button
              onClick={() => setStatus("recomendacao")}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg border transition-colors ${
                status === "recomendacao"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              Recomendacao
            </button>
          </div>
        </div>

        {/* Procedures */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Procedimentos</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicione um procedimento"
              value={novoProcedimento}
              onChange={(e) => setNovoProcedimento(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProcedimento()}
              className={inputClasses + " flex-1"}
            />
            <button
              onClick={addProcedimento}
              className="w-11 h-11 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {procedimentos.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {procedimentos.map((proc, i) => (
                <div key={i} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground flex-1">{proc}</span>
                  <button onClick={() => removeProcedimento(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
          disabled={!selectedPaciente || !tipo || !descricao}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Tratamento
        </button>
      </div>
    </MobileShell>
  )
}
