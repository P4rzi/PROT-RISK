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
        <p className="text-sm text-muted-foreground">Carregando sessão...</p>
      </div>
    )
  }

  const BrandingPanel = () => (
    <div className="hidden lg:flex lg:w-[46%] bg-[hsl(228,28%,12%)] relative overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">ProtRisk</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Sistema
            <br />
            Odontológico
            <br />
            <span className="text-[hsl(166,60%,50%)]">Inteligente</span>
          </h2>
          <p className="text-base text-white/50 max-w-sm leading-relaxed">
            Gerencie tratamentos protéticos com análise de risco.
            Acompanhe pacientes, procedimentos e anamneses em um só lugar.
          </p>
        </div>

        <p className="text-xs text-white/20 font-medium">v1.0.0 — ProtRisk</p>
      </div>
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[hsl(166,64%,32%)]/8" />
      <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-[hsl(166,64%,32%)]/5" />
    </div>
  )

  // First access success
  if (step === "primeiro-acesso-sucesso") {
    return (
      <div className="flex min-h-screen">
        <BrandingPanel />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center gap-5 animate-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground text-center">Cadastro realizado!</h2>
            <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-xs">
              Sua conta foi criada com sucesso. Você será redirecionado em instantes.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // First access - password step
  if (step === "primeiro-acesso-senha") {
    return (
      <div className="flex min-h-screen">
        <BrandingPanel />
        <div className="flex-1 flex flex-col">
          <div className="lg:hidden flex items-center gap-3 px-6 pt-8 pb-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">ProtRisk</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12">
            <div className="w-full max-w-[420px] animate-in">
              <button
                onClick={() => setStep("primeiro-acesso-cpf")}
                className="flex items-center gap-1.5 text-sm text-primary font-medium mb-6 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-1">Crie sua senha</h2>
              <p className="text-sm text-muted-foreground mb-8">
                Defina uma senha segura para acessar sua conta
              </p>

              <div className="flex flex-col gap-4">
                <div className="bg-primary/5 rounded-lg p-3.5 border border-primary/10">
                  <p className="text-xs text-muted-foreground">Paciente</p>
                  <p className="text-sm font-semibold text-foreground">{nomeCompleto}</p>
                  <p className="text-xs text-muted-foreground">{novoCpf}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nova senha</label>
                  <div className="relative">
                    <input
                      type={showNovaSenha ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
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

                {firstAccessError && <p className="text-sm text-destructive">{firstAccessError}</p>}

                <button
                  onClick={handleFirstAccessSenha}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-110 transition-all mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Criando conta..." : "Criar conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // First access - CPF step
  if (step === "primeiro-acesso-cpf") {
    return (
      <div className="flex min-h-screen">
        <BrandingPanel />
        <div className="flex-1 flex flex-col">
          <div className="lg:hidden flex items-center gap-3 px-6 pt-8 pb-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">ProtRisk</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12">
            <div className="w-full max-w-[420px] animate-in">
              <button
                onClick={resetFirstAccess}
                className="flex items-center gap-1.5 text-sm text-primary font-medium mb-6 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao login
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-1">Primeiro acesso</h2>
              <p className="text-sm text-muted-foreground mb-8">
                Informe seu CPF e nome completo para criar sua conta
              </p>

              <div className="flex flex-col gap-4">
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

                {firstAccessError && <p className="text-sm text-destructive">{firstAccessError}</p>}

                <button
                  onClick={handleFirstAccessCpf}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-110 transition-all mt-2"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main login screen
  return (
    <div className="flex min-h-screen">
      <BrandingPanel />

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-6 pt-8 pb-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground tracking-tight">ProtRisk</p>
            <p className="text-[11px] text-muted-foreground">Sistema Odontológico</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12">
          <div className="w-full max-w-[420px] animate-in">
            {/* Mode toggle */}
            <div className="flex bg-muted rounded-lg p-1 mb-10">
              <button
                onClick={() => { setMode("paciente"); setIdentifier(""); setError("") }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                  mode === "paciente"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                Paciente
              </button>
              <button
                onClick={() => { setMode("dentista"); setIdentifier(""); setError("") }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                  mode === "dentista"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                Dentista
              </button>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {mode === "paciente" ? "Olá, Paciente" : "Olá, Doutor(a)"}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {mode === "paciente"
                ? "Acesse seus tratamentos e informações"
                : "Gerencie seus pacientes e tratamentos"}
            </p>

            {/* Fields */}
            <div className="flex flex-col gap-4">
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
                <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-110 transition-all mt-2 disabled:opacity-50"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>

              <div className="flex items-center justify-between mt-2">
                <button className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">
                  Esqueci minha senha
                </button>
                {mode === "paciente" && (
                  <button
                    onClick={() => setStep("primeiro-acesso-cpf")}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Cadastre-se
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="lg:hidden px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/60">v1.0.0 — ProtRisk</p>
        </div>
      </div>
    </div>
  )
}
