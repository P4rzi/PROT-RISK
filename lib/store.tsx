"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

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
  riscos: string[]
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
  imagens: string[]
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3333/api/v1"

const ACCESS_TOKEN_KEY = "protrisk.accessToken"
const REFRESH_TOKEN_KEY = "protrisk.refreshToken"

type TratamentoStatus = "em_andamento" | "finalizado" | "recomendacao"

interface ApiProfilePaciente {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  dataNascimento: string | null
}

interface ApiProfileDentista {
  id: string
  nome: string
  cro: string
  especialidade: string
}

interface ApiAuthUser {
  id: string
  role: UserRole
  profile: ApiProfilePaciente | ApiProfileDentista
}

interface ApiAuthResponse {
  accessToken: string
  refreshToken: string
  user: ApiAuthUser
}

interface ApiTratamento {
  id: string
  pacienteId: string
  dentistaId: string
  tipo: string
  descricao: string
  status: TratamentoStatus
  dataInicio: string
  dataFim?: string | null
  proximaConsulta?: string | null
  observacoes: string
  procedimentos: string[]
  dentista?: { id: string; nome: string; cro: string; especialidade: string }
  paciente?: { id: string; nome: string; cpf: string; telefone: string; email: string; dataNascimento?: string | null }
}

interface ApiAnamnese {
  id: string
  pacienteId: string
  dentistaId: string
  data: string
  alergias: string
  medicamentos: string
  doencasPreExistentes: string
  riscos: string[]
  historicoFamiliar: string
  habitos: string
  queixaPrincipal: string
  observacoes: string
}

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
  isInitializing: boolean
  setRole: (role: UserRole) => void
  setCurrentUser: (user: Paciente | Dentista | null) => void
  login: (role: UserRole, identifier: string, senha: string) => Promise<void>
  logout: () => void
  navigate: (screen: string, params?: Record<string, string>) => void
  goBack: () => void
  history: string[]
  historyParams: Record<string, string>[]
  addAnamnese: (anamnese: Anamnese) => Promise<void>
  addTratamento: (tratamento: Tratamento) => Promise<void>
  registrarPaciente: (cpf: string, nome: string, senha: string) => Promise<Paciente>
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null)
  const [currentUser, setCurrentUser] = useState<Paciente | Dentista | null>(null)
  const [screen, setScreen] = useState("login")
  const [screenParams, setScreenParams] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<string[]>([])
  const [historyParams, setHistoryParams] = useState<Record<string, string>[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [dentistas, setDentistas] = useState<Dentista[]>([])
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([])
  const [anamneses, setAnamneses] = useState<Anamnese[]>([])
  const [tiposTratamento, setTiposTratamento] = useState<TipoTratamento[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const accessTokenRef = useRef<string | null>(null)
  const refreshTokenRef = useRef<string | null>(null)

  const persistTokens = (nextAccessToken: string | null, nextRefreshToken: string | null) => {
    accessTokenRef.current = nextAccessToken
    refreshTokenRef.current = nextRefreshToken
    setAccessToken(nextAccessToken)
    setRefreshToken(nextRefreshToken)

    if (typeof window === "undefined") return
    if (nextAccessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }

    if (nextRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  }

  const mapApiPaciente = (profile: ApiProfilePaciente): Paciente => ({
    id: profile.id,
    nome: profile.nome,
    cpf: profile.cpf,
    telefone: profile.telefone,
    email: profile.email,
    dataNascimento: profile.dataNascimento ?? "",
  })

  const mapApiDentista = (profile: ApiProfileDentista): Dentista => ({
    id: profile.id,
    nome: profile.nome,
    cro: profile.cro,
    especialidade: profile.especialidade,
  })

  const mapApiTratamento = (item: ApiTratamento): Tratamento => ({
    id: item.id,
    pacienteId: item.pacienteId,
    dentistaId: item.dentistaId,
    tipo: item.tipo,
    descricao: item.descricao,
    status: item.status,
    dataInicio: item.dataInicio,
    dataFim: item.dataFim ?? undefined,
    proximaConsulta: item.proximaConsulta ?? undefined,
    observacoes: item.observacoes,
    procedimentos: item.procedimentos,
  })

  const mapApiAnamnese = (item: ApiAnamnese): Anamnese => ({
    id: item.id,
    pacienteId: item.pacienteId,
    dentistaId: item.dentistaId,
    data: item.data,
    alergias: item.alergias,
    medicamentos: item.medicamentos,
    doencasPreExistentes: item.doencasPreExistentes,
    riscos: item.riscos,
    historicoFamiliar: item.historicoFamiliar,
    habitos: item.habitos,
    queixaPrincipal: item.queixaPrincipal,
    observacoes: item.observacoes,
  })

  const extractErrorMessage = (payload: unknown, fallback = "Erro ao comunicar com servidor") => {
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
    ) {
      return payload.error.message
    }
    return fallback
  }

  const apiFetch = async <T,>(
    path: string,
    options: RequestInit = {},
    token?: string | null,
  ): Promise<T> => {
    const headers = new Headers(options.headers)
    headers.set("Content-Type", "application/json")
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(extractErrorMessage(data))
    }

    return data as T
  }

  const refreshAccess = async () => {
    if (!refreshTokenRef.current) return null

    const data = await apiFetch<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshTokenRef.current }),
    })

    persistTokens(data.accessToken, refreshTokenRef.current)
    return data.accessToken
  }

  const apiFetchWithAuth = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    if (!accessTokenRef.current) {
      throw new Error("Sessao expirada")
    }

    try {
      return await apiFetch<T>(path, options, accessTokenRef.current)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sessao expirada"
      if (!message.toLowerCase().includes("token")) {
        throw error
      }

      const nextAccess = await refreshAccess()
      if (!nextAccess) {
        throw error
      }

      return apiFetch<T>(path, options, nextAccess)
    }
  }

  const hydrateCurrentUser = (user: ApiAuthUser) => {
    setRoleState(user.role)
    if (user.role === "paciente") {
      setCurrentUser(mapApiPaciente(user.profile as ApiProfilePaciente))
      setScreen("paciente-home")
      return
    }

    setCurrentUser(mapApiDentista(user.profile as ApiProfileDentista))
    setScreen("dentista-home")
  }

  const loadTiposTratamento = async () => {
    const data = await apiFetchWithAuth<{ items: TipoTratamento[] }>("/tipos-tratamento?limit=100")
    setTiposTratamento(data.items ?? [])
  }

  const loadPacienteData = async () => {
    const [emAndamento, finalizados, recomendacoes, anamneseResponse] = await Promise.all([
      apiFetchWithAuth<ApiTratamento[]>("/pacientes/me/tratamentos?status=em_andamento"),
      apiFetchWithAuth<ApiTratamento[]>("/pacientes/me/tratamentos?status=finalizado"),
      apiFetchWithAuth<ApiTratamento[]>("/pacientes/me/tratamentos?status=recomendacao"),
      apiFetchWithAuth<{ item: ApiAnamnese | null }>("/pacientes/me/anamnese"),
    ])

    const allTreatments = [...emAndamento, ...finalizados, ...recomendacoes]
    setTratamentos(allTreatments.map(mapApiTratamento))

    const dentistsMap = new Map<string, Dentista>()
    allTreatments.forEach((item) => {
      if (!item.dentista) return
      dentistsMap.set(item.dentista.id, mapApiDentista(item.dentista))
    })
    setDentistas(Array.from(dentistsMap.values()))

    if (anamneseResponse.item) {
      setAnamneses([mapApiAnamnese(anamneseResponse.item)])
    } else {
      setAnamneses([])
    }
  }

  const loadDentistaData = async () => {
    const [pacientesResponse, tratamentosResponse] = await Promise.all([
      apiFetchWithAuth<Paciente[]>("/dentistas/me/pacientes"),
      apiFetchWithAuth<ApiTratamento[]>("/dentistas/me/tratamentos"),
    ])

    const normalizedPacientes = pacientesResponse.map((p) => ({
      ...p,
      dataNascimento: p.dataNascimento ?? "",
    }))
    setPacientes(normalizedPacientes)

    const normalizedTratamentos = tratamentosResponse.map(mapApiTratamento)
    setTratamentos(normalizedTratamentos)

    const anamnesePromises = normalizedPacientes.map((paciente) =>
      apiFetchWithAuth<{ item: ApiAnamnese | null }>(`/pacientes/${paciente.id}/anamnese`).catch(() => ({ item: null })),
    )
    const anamneseResults = await Promise.all(anamnesePromises)
    setAnamneses(
      anamneseResults
        .map((result) => result.item)
        .filter((item): item is ApiAnamnese => item !== null)
        .map(mapApiAnamnese),
    )
  }

  const hydrateData = async (nextRole: UserRole) => {
    await loadTiposTratamento()
    if (nextRole === "paciente") {
      await loadPacienteData()
    } else {
      await loadDentistaData()
    }
  }

  const clearSessionState = () => {
    setRoleState(null)
    setCurrentUser(null)
    setPacientes([])
    setDentistas([])
    setTratamentos([])
    setAnamneses([])
    setTiposTratamento([])
    setScreen("login")
    setScreenParams({})
    setHistory([])
    setHistoryParams([])
    persistTokens(null, null)
  }

  const login = async (nextRole: UserRole, identifier: string, senha: string) => {
    const data = await apiFetch<ApiAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ role: nextRole, identifier, senha }),
    })

    persistTokens(data.accessToken, data.refreshToken)
    hydrateCurrentUser(data.user)
    await hydrateData(data.user.role)
  }

  const logout = () => {
    clearSessionState()
  }

  const registrarPaciente = async (cpf: string, nome: string, senha: string): Promise<Paciente> => {
    const data = await apiFetch<ApiAuthResponse>("/auth/pacientes/primeiro-acesso", {
      method: "POST",
      body: JSON.stringify({ cpf, nome, senha }),
    })

    persistTokens(data.accessToken, data.refreshToken)
    hydrateCurrentUser(data.user)
    await hydrateData("paciente")

    return mapApiPaciente(data.user.profile as ApiProfilePaciente)
  }

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
    return apiFetchWithAuth<ApiAnamnese>("/anamneses", {
      method: "POST",
      body: JSON.stringify({
        pacienteId: anamnese.pacienteId,
        data: anamnese.data,
        alergias: anamnese.alergias,
        medicamentos: anamnese.medicamentos,
        doencasPreExistentes: anamnese.doencasPreExistentes,
        riscos: anamnese.riscos,
        historicoFamiliar: anamnese.historicoFamiliar,
        habitos: anamnese.habitos,
        queixaPrincipal: anamnese.queixaPrincipal,
        observacoes: anamnese.observacoes,
      }),
    }).then((created) => {
      setAnamneses((prev) => [mapApiAnamnese(created), ...prev])
    })
  }

  const addTratamento = (tratamento: Tratamento) => {
    return apiFetchWithAuth<ApiTratamento>("/tratamentos", {
      method: "POST",
      body: JSON.stringify({
        pacienteId: tratamento.pacienteId,
        tipo: tratamento.tipo,
        descricao: tratamento.descricao,
        status: tratamento.status,
        dataInicio: tratamento.dataInicio,
        dataFim: tratamento.dataFim,
        proximaConsulta: tratamento.proximaConsulta,
        observacoes: tratamento.observacoes,
        procedimentos: tratamento.procedimentos,
      }),
    }).then((created) => {
      setTratamentos((prev) => [mapApiTratamento(created), ...prev])
    })
  }

  const setRole = (nextRole: UserRole) => {
    setRoleState(nextRole)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!storedAccess || !storedRefresh) {
      setIsInitializing(false)
      return
    }

    persistTokens(storedAccess, storedRefresh)

    const restore = async () => {
      try {
        const user = await apiFetch<ApiAuthUser>("/auth/me", {}, storedAccess)
        hydrateCurrentUser(user)
        await hydrateData(user.role)
      } catch {
        clearSessionState()
      } finally {
        setIsInitializing(false)
      }
    }

    void restore()
  }, [])

  const value = useMemo<AppState>(
    () => ({
      role,
      currentUser,
      screen,
      screenParams,
      pacientes,
      dentistas,
      tratamentos,
      anamneses,
      tiposTratamento,
      isInitializing,
      setRole,
      setCurrentUser,
      login,
      logout,
      navigate,
      goBack,
      history,
      historyParams,
      addAnamnese,
      addTratamento,
      registrarPaciente,
    }),
    [
      role,
      currentUser,
      screen,
      screenParams,
      pacientes,
      dentistas,
      tratamentos,
      anamneses,
      tiposTratamento,
      isInitializing,
      history,
      historyParams,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
