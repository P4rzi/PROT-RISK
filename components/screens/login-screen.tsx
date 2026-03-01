"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"

type Step = "login" | "primeiro-acesso-cpf" | "primeiro-acesso-senha" | "primeiro-acesso-sucesso"

export function LoginScreen() {
  const { setRole, setCurrentUser, navigate, pacientes, dentistas, registrarPaciente } = useApp()
  const [mode, setMode] = useState<"paciente" | "dentista">("paciente")
  const [identifier, setIdentifier] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // First access state
  const [step, setStep] = useState<Step>("login")
  const [novoCpf, setNovoCpf] = useState("")
  const [nomeCompleto, setNomeCompleto] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [firstAccessError, setFirstAccessError] = useState("")

  const handleLogin = () => {
    setError("")
    if (!identifier || !senha) {
      setError("Preencha todos os campos")
      return
    }

    if (mode === "paciente") {
      const paciente = pacientes.find((p) => p.cpf === identifier)
      if (paciente) {
        setRole("paciente")
        setCurrentUser(paciente)
        navigate("paciente-home")
      } else {
        setError("CPF nao encontrado. Use 'Primeiro acesso' para se cadastrar.")
      }
    } else {
      const dentista = dentistas.find((d) => d.cro === identifier)
      if (dentista) {
        setRole("dentista")
        setCurrentUser(dentista)
        navigate("dentista-home")
      } else {
        setRole("dentista")
        setCurrentUser(dentistas[0])
        navigate("dentista-home")
      }
    }
  }

  const handleFirstAccessCpf = () => {
    setFirstAccessError("")
    if (!novoCpf) {
      setFirstAccessError("Informe seu CPF")
      return
    }
    if (!nomeCompleto) {
      setFirstAccessError("Informe seu nome completo")
      return
    }
    const existe = pacientes.find((p) => p.cpf === novoCpf)
    if (existe) {
      setFirstAccessError("CPF ja cadastrado. Faca login normalmente.")
      return
    }
    setStep("primeiro-acesso-senha")
  }

  const handleFirstAccessSenha = () => {
    setFirstAccessError("")
    if (!novaSenha || !confirmarSenha) {
      setFirstAccessError("Preencha todos os campos")
      return
    }
    if (novaSenha.length < 6) {
      setFirstAccessError("A senha deve ter no minimo 6 caracteres")
      return
    }
    if (novaSenha !== confirmarSenha) {
      setFirstAccessError("As senhas nao coincidem")
      return
    }
    const novoPaciente = registrarPaciente(novoCpf, nomeCompleto)
    setRole("paciente")
    setCurrentUser(novoPaciente)
    setStep("primeiro-acesso-sucesso")
    setTimeout(() => {
      navigate("paciente-home")
    }, 2000)
  }

  const resetFirstAccess = () => {
    setStep("login")
    setNovoCpf("")
    setNomeCompleto("")
    setNovaSenha("")
    setConfirmarSenha("")
    setFirstAccessError("")
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"

  // First access success
  if (step === "primeiro-acesso-sucesso") {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-foreground text-center">Cadastro realizado!</h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Sua conta foi criada com sucesso. Voce sera redirecionado em instantes.
          </p>
        </div>
      </div>
    )
  }

  // First access - password step
  if (step === "primeiro-acesso-senha") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">ProtRisk</h1>
          </div>

          <div className="w-full mb-6">
            <button
              onClick={() => setStep("primeiro-acesso-cpf")}
              className="flex items-center gap-1 text-sm text-primary font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-lg font-semibold text-foreground">Crie sua senha</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Defina uma senha segura para acessar sua conta
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
              <p className="text-xs text-muted-foreground">Paciente</p>
              <p className="text-sm font-semibold text-foreground">{nomeCompleto}</p>
              <p className="text-xs text-muted-foreground">{novoCpf}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nova senha</label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  placeholder="Minimo 6 caracteres"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={inputClasses + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showNovaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirmar ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={inputClasses + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmar ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {firstAccessError && (
              <p className="text-sm text-destructive">{firstAccessError}</p>
            )}

            <button
              onClick={handleFirstAccessSenha}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    )
  }

  // First access - CPF step
  if (step === "primeiro-acesso-cpf") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">ProtRisk</h1>
          </div>

          <div className="w-full mb-6">
            <button
              onClick={resetFirstAccess}
              className="flex items-center gap-1 text-sm text-primary font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </button>
            <h2 className="text-lg font-semibold text-foreground">Primeiro acesso</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Informe seu CPF e nome completo para criar sua conta
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={novoCpf}
                onChange={(e) => setNovoCpf(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className={inputClasses}
              />
            </div>

            {firstAccessError && (
              <p className="text-sm text-destructive">{firstAccessError}</p>
            )}

            <button
              onClick={handleFirstAccessCpf}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main login screen
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">ProtRisk</h1>
          <p className="text-sm text-muted-foreground text-center">Sistema Odontologico</p>
        </div>

        {/* Tabs */}
        <div className="w-full flex bg-secondary rounded-lg p-1 mb-8">
          <button
            onClick={() => { setMode("paciente"); setIdentifier(""); setError("") }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
              mode === "paciente"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Paciente
          </button>
          <button
            onClick={() => { setMode("dentista"); setIdentifier(""); setError("") }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
              mode === "dentista"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Dentista
          </button>
        </div>

        {/* Welcome */}
        <div className="w-full mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {"Bem-vindo, " + (mode === "paciente" ? "Paciente" : "Dr./Dra.")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "paciente"
              ? "Acesse seus tratamentos e informacoes"
              : "Gerencie seus pacientes e tratamentos"}
          </p>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {mode === "paciente" ? "CPF" : "CRO"}
            </label>
            <input
              type="text"
              placeholder={mode === "paciente" ? "000.000.000-00" : "CRO-SP 00000"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={inputClasses + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2"
          >
            Entrar
          </button>

          <div className="flex flex-col items-center gap-2 mt-1">
            <button className="text-sm text-primary font-medium">
              Esqueci minha senha
            </button>
            {mode === "paciente" && (
              <button
                onClick={() => setStep("primeiro-acesso-cpf")}
                className="text-sm text-accent font-medium"
              >
                Primeiro acesso? Cadastre-se
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          {"v1.0.0 - ProtRisk Sistema Odontologico"}
        </p>
      </div>
    </div>
  )
}
