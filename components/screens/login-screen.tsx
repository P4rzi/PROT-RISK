"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { Shield, Eye, EyeOff } from "lucide-react"

export function LoginScreen() {
  const { setRole, setCurrentUser, navigate, pacientes, dentistas } = useApp()
  const [mode, setMode] = useState<"paciente" | "dentista">("paciente")
  const [identifier, setIdentifier] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

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
        // Demo: allow any login
        setRole("paciente")
        setCurrentUser(pacientes[0])
        navigate("paciente-home")
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
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
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
                className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
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

          <button className="text-sm text-primary font-medium text-center mt-1">
            Esqueci minha senha
          </button>
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
