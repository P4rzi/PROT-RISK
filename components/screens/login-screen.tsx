"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"

type Step = "login" | "primeiro-acesso-cpf" | "primeiro-acesso-senha" | "primeiro-acesso-sucesso"

export function LoginScreen() {
  const { login, navigate, registrarPaciente, isInitializing } = useApp()
  const [mode, setMode] = useState<"paciente" | "dentista">("paciente")
  const [identifier, setIdentifier] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // First access state
  const [step, setStep] = useState<Step>("login")
  const [novoCpf, setNovoCpf] = useState("")
  const [nomeCompleto, setNomeCompleto] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [firstAccessError, setFirstAccessError] = useState("")

  const handleLogin = async () => {
    setError("")
    if (!identifier || !senha) {
      setError("Preencha todos os campos")
      return
    }

    setIsSubmitting(true)
    try {
      await login(mode, identifier, senha)
      toast({
        title: "Login realizado",
        description: "Sessao autenticada com sucesso.",
      })
      navigate(mode === "paciente" ? "paciente-home" : "dentista-home")
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao autenticar"
      setError(message)
      toast({
        title: "Falha no login",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
    setStep("primeiro-acesso-senha")
  }

  const handleFirstAccessSenha = async () => {
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

    setIsSubmitting(true)
    try {
      await registrarPaciente(novoCpf, nomeCompleto, novaSenha)
      toast({
        title: "Conta criada",
        description: "Seu cadastro foi realizado com sucesso.",
      })
      setStep("primeiro-acesso-sucesso")
      setTimeout(() => {
        navigate("paciente-home")
      }, 1200)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao criar conta"
      setFirstAccessError(message)
      toast({
        title: "Falha no cadastro",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-sm text-muted-foreground">Carregando sessao...</p>
      </div>
    )
  }

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
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
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
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mt-2"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
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
