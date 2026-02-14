"use client"

import { useState } from "react"
import { useApp, type Dentista } from "@/lib/store"
import { MobileShell } from "@/components/mobile-shell"
import { ChevronRight, Search, User, Phone, Mail } from "lucide-react"

export function DentistaPacientesLista() {
  const { pacientes, navigate, tratamentos, currentUser } = useApp()
  const dentista = currentUser as Dentista
  const [search, setSearch] = useState("")

  const meusTratamentos = tratamentos.filter((t) => t.dentistaId === dentista.id)
  const meusPacienteIds = new Set(meusTratamentos.map((t) => t.pacienteId))
  const meusPacientes = pacientes.filter((p) => meusPacienteIds.has(p.id))

  const filteredPacientes = meusPacientes.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search)
  )

  return (
    <MobileShell title="Pacientes">
      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {filteredPacientes.length} paciente{filteredPacientes.length !== 1 ? "s" : ""} encontrado{filteredPacientes.length !== 1 ? "s" : ""}
        </p>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filteredPacientes.map((paciente) => {
            const pacienteTratamentos = meusTratamentos.filter(
              (t) => t.pacienteId === paciente.id && t.status === "em_andamento"
            ).length
            return (
              <button
                key={paciente.id}
                onClick={() => navigate("dentista-paciente-detalhe", { id: paciente.id })}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{paciente.nome}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{paciente.cpf}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {paciente.telefone}
                    </span>
                  </div>
                  {pacienteTratamentos > 0 && (
                    <span className="inline-flex items-center text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1.5">
                      {pacienteTratamentos} em andamento
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </MobileShell>
  )
}
