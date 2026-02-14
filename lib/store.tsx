"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "paciente" | "dentista"

export interface Paciente {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  dataNascimento: string
}

export interface Dentista {
  id: string
  nome: string
  cro: string
  especialidade: string
}

export interface Tratamento {
  id: string
  pacienteId: string
  dentistaId: string
  tipo: string
  descricao: string
  status: "em_andamento" | "finalizado" | "recomendacao"
  dataInicio: string
  dataFim?: string
  proximaConsulta?: string
  observacoes: string
  procedimentos: string[]
}

export interface Anamnese {
  id: string
  pacienteId: string
  dentistaId: string
  data: string
  alergias: string
  medicamentos: string
  doencasPreExistentes: string
  historicoFamiliar: string
  habitos: string
  queixaPrincipal: string
  observacoes: string
}

export interface TipoTratamento {
  id: string
  nome: string
  descricao: string
  categoria: string
  duracao: string
  indicacoes: string
  contraindicacoes: string
  imagem?: string
}

// Mock data
const mockPacientes: Paciente[] = [
  { id: "1", nome: "Maria Silva", cpf: "123.456.789-00", telefone: "(11) 98765-4321", email: "maria@email.com", dataNascimento: "1990-05-15" },
  { id: "2", nome: "Joao Santos", cpf: "987.654.321-00", telefone: "(11) 91234-5678", email: "joao@email.com", dataNascimento: "1985-08-22" },
  { id: "3", nome: "Ana Oliveira", cpf: "456.789.123-00", telefone: "(11) 93456-7890", email: "ana@email.com", dataNascimento: "1995-03-10" },
  { id: "4", nome: "Carlos Pereira", cpf: "321.654.987-00", telefone: "(11) 94567-8901", email: "carlos@email.com", dataNascimento: "1978-12-01" },
  { id: "5", nome: "Lucia Fernandes", cpf: "654.321.987-00", telefone: "(11) 95678-9012", email: "lucia@email.com", dataNascimento: "1992-07-18" },
]

const mockDentistas: Dentista[] = [
  { id: "1", nome: "Dr. Roberto Almeida", cro: "CRO-SP 12345", especialidade: "Protese Dentaria" },
  { id: "2", nome: "Dra. Fernanda Costa", cro: "CRO-SP 67890", especialidade: "Ortodontia" },
]

const mockTratamentos: Tratamento[] = [
  { id: "1", pacienteId: "1", dentistaId: "1", tipo: "Protese Total", descricao: "Protese total superior e inferior", status: "em_andamento", dataInicio: "2025-01-15", proximaConsulta: "2025-03-20", observacoes: "Paciente em fase de adaptacao", procedimentos: ["Moldagem inicial", "Prova de dentes", "Instalacao"] },
  { id: "2", pacienteId: "1", dentistaId: "1", tipo: "Protese Parcial", descricao: "Protese parcial removivel inferior", status: "finalizado", dataInicio: "2024-06-10", dataFim: "2024-12-20", observacoes: "Tratamento concluido com sucesso", procedimentos: ["Exame clinico", "Moldagem", "Ajuste oclusal", "Entrega final"] },
  { id: "3", pacienteId: "2", dentistaId: "1", tipo: "Implante Dentario", descricao: "Implante unitario dente 36", status: "em_andamento", dataInicio: "2025-02-01", proximaConsulta: "2025-04-15", observacoes: "Aguardando osseointegacao", procedimentos: ["Cirurgia de implante", "Reabertura", "Moldagem sobre implante"] },
  { id: "4", pacienteId: "3", dentistaId: "2", tipo: "Protese Fixa", descricao: "Coroa metalocermica dente 14", status: "recomendacao", dataInicio: "2025-03-01", observacoes: "Recomendacao para inicio apos avaliacao", procedimentos: ["Preparo dental", "Moldagem", "Prova", "Cimentacao"] },
  { id: "5", pacienteId: "2", dentistaId: "1", tipo: "Protese Total", descricao: "Protese total superior", status: "finalizado", dataInicio: "2024-03-01", dataFim: "2024-09-15", observacoes: "Paciente bem adaptado", procedimentos: ["Moldagem anatomica", "Moldagem funcional", "Registro oclusal", "Prova", "Instalacao"] },
  { id: "6", pacienteId: "4", dentistaId: "1", tipo: "Faceta em Porcelana", descricao: "Facetas nos dentes 11 a 21", status: "em_andamento", dataInicio: "2025-01-20", proximaConsulta: "2025-03-25", observacoes: "Em fase de preparo", procedimentos: ["Planejamento digital", "Mock-up", "Preparo", "Moldagem", "Cimentacao"] },
  { id: "7", pacienteId: "5", dentistaId: "2", tipo: "Protese sobre Implante", descricao: "Protocolosuperiorsobre 6 implantes", status: "recomendacao", dataInicio: "2025-04-01", observacoes: "Paciente em avaliacao pre-operatoria", procedimentos: ["Exames complementares", "Cirurgia", "Moldagem", "Instalacao"] },
]

const mockAnamneses: Anamnese[] = [
  { id: "1", pacienteId: "1", dentistaId: "1", data: "2025-01-10", alergias: "Penicilina", medicamentos: "Anti-hipertensivo", doencasPreExistentes: "Hipertensao", historicoFamiliar: "Diabetes na familia", habitos: "Nao fuma", queixaPrincipal: "Dificuldade para mastigar", observacoes: "Paciente colaborativo" },
  { id: "2", pacienteId: "2", dentistaId: "1", data: "2025-01-28", alergias: "Nenhuma", medicamentos: "Nenhum", doencasPreExistentes: "Nenhuma", historicoFamiliar: "Sem historico relevante", habitos: "Ex-fumante", queixaPrincipal: "Perda dentaria", observacoes: "Boa saude geral" },
]

const mockTiposTratamento: TipoTratamento[] = [
  { id: "1", nome: "Protese Total", descricao: "A protese total, conhecida como dentadura, e uma protese removivel que substitui todos os dentes de uma arcada. E indicada para pacientes que perderam todos os dentes.", categoria: "Protese Removivel", duracao: "4 a 6 meses", indicacoes: "Perda total dos dentes, reabsorcao ossea significativa", contraindicacoes: "Alergia ao material acrilico" },
  { id: "2", nome: "Protese Parcial Removivel", descricao: "Protese que substitui um ou mais dentes perdidos, podendo ser removida pelo paciente para higienizacao. Possui estrutura metalica ou em resina.", categoria: "Protese Removivel", duracao: "3 a 5 meses", indicacoes: "Perda parcial de dentes, necessidade de reabilitacao estetica e funcional", contraindicacoes: "Doenca periodontal nao tratada" },
  { id: "3", nome: "Protese Fixa (Coroa)", descricao: "Restauracao protesica que recobre totalmente um dente comprometido. Pode ser metalocermica, em zirconia ou em porcelana pura.", categoria: "Protese Fixa", duracao: "2 a 4 semanas", indicacoes: "Dente com grande destruicao coronaria, pos tratamento endodontico", contraindicacoes: "Raiz comprometida, doenca periodontal avancada" },
  { id: "4", nome: "Implante Dentario", descricao: "Pino de titanio inserido cirurgicamente no osso maxilar ou mandibular para substituir a raiz de um dente perdido. Sobre ele e instalada uma protese.", categoria: "Implantodontia", duracao: "4 a 8 meses", indicacoes: "Perda de um ou mais dentes com osso suficiente", contraindicacoes: "Quantidade ossea insuficiente, doencas sistemicas nao controladas" },
  { id: "5", nome: "Faceta em Porcelana", descricao: "Lamina fina de porcelana colada na face vestibular dos dentes anteriores para melhorar estetica. Corrige cor, forma e alinhamento.", categoria: "Estetica", duracao: "2 a 3 semanas", indicacoes: "Dentes escurecidos, mal posicionados, com diastemas", contraindicacoes: "Bruxismo severo, higiene oral deficiente" },
  { id: "6", nome: "Protese sobre Implante (Protocolo)", descricao: "Protese fixa sobre implantes que substitui todos os dentes de uma arcada. Oferece maior estabilidade e conforto comparado a protese total convencional.", categoria: "Implantodontia", duracao: "6 a 12 meses", indicacoes: "Edentulismo total com desejo de protese fixa", contraindicacoes: "Insuficiencia ossea severa, condicoes sistemicas comprometedoras" },
]

interface AppState {
  role: UserRole | null
  currentUser: Paciente | Dentista | null
  screen: string
  screenParams: Record<string, string>
  pacientes: Paciente[]
  dentistas: Dentista[]
  tratamentos: Tratamento[]
  anamneses: Anamnese[]
  tiposTratamento: TipoTratamento[]
  setRole: (role: UserRole) => void
  setCurrentUser: (user: Paciente | Dentista | null) => void
  navigate: (screen: string, params?: Record<string, string>) => void
  goBack: () => void
  history: string[]
  historyParams: Record<string, string>[]
  addAnamnese: (anamnese: Anamnese) => void
  addTratamento: (tratamento: Tratamento) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [currentUser, setCurrentUser] = useState<Paciente | Dentista | null>(null)
  const [screen, setScreen] = useState("login")
  const [screenParams, setScreenParams] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<string[]>([])
  const [historyParams, setHistoryParams] = useState<Record<string, string>[]>([])
  const [pacientes] = useState(mockPacientes)
  const [dentistas] = useState(mockDentistas)
  const [tratamentos, setTratamentos] = useState(mockTratamentos)
  const [anamneses, setAnamneses] = useState(mockAnamneses)
  const [tiposTratamento] = useState(mockTiposTratamento)

  const navigate = (newScreen: string, params?: Record<string, string>) => {
    setHistory((prev) => [...prev, screen])
    setHistoryParams((prev) => [...prev, screenParams])
    setScreen(newScreen)
    setScreenParams(params || {})
  }

  const goBack = () => {
    if (history.length > 0) {
      const prevScreen = history[history.length - 1]
      const prevParams = historyParams[historyParams.length - 1]
      setHistory((prev) => prev.slice(0, -1))
      setHistoryParams((prev) => prev.slice(0, -1))
      setScreen(prevScreen)
      setScreenParams(prevParams || {})
    }
  }

  const addAnamnese = (anamnese: Anamnese) => {
    setAnamneses((prev) => [...prev, anamnese])
  }

  const addTratamento = (tratamento: Tratamento) => {
    setTratamentos((prev) => [...prev, tratamento])
  }

  return (
    <AppContext.Provider
      value={{
        role,
        currentUser,
        screen,
        screenParams,
        pacientes,
        dentistas,
        tratamentos,
        anamneses,
        tiposTratamento,
        setRole,
        setCurrentUser,
        navigate,
        goBack,
        history,
        historyParams,
        addAnamnese,
        addTratamento,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
