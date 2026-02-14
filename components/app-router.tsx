"use client"

import { useApp } from "@/lib/store"
import { LoginScreen } from "@/components/screens/login-screen"
import { PacienteHome } from "@/components/screens/paciente/home"
import { PacienteTratamentosLista } from "@/components/screens/paciente/tratamentos-lista"
import { PacienteTratamentoDetalhe } from "@/components/screens/paciente/tratamento-detalhe"
import { PacienteAnamneseView } from "@/components/screens/paciente/anamnese-view"
import { TiposTratamentoScreen } from "@/components/screens/tipos-tratamento"
import { TipoTratamentoDetalheScreen } from "@/components/screens/tipo-tratamento-detalhe"
import { DentistaHome } from "@/components/screens/dentista/home"
import { DentistaPacientesLista } from "@/components/screens/dentista/pacientes-lista"
import { DentistaPacienteDetalhe } from "@/components/screens/dentista/paciente-detalhe"
import { DentistaTratamentosLista } from "@/components/screens/dentista/tratamentos-lista"
import { DentistaTratamentoDetalhe } from "@/components/screens/dentista/tratamento-detalhe"
import { DentistaAnamneseForm } from "@/components/screens/dentista/anamnese-form"
import { DentistaAnamneseView } from "@/components/screens/dentista/anamnese-view"
import { DentistaNovoTratamento } from "@/components/screens/dentista/novo-tratamento"
import { DentistaPacientesTratamentos } from "@/components/screens/dentista/pacientes-tratamentos"

const screens: Record<string, React.ComponentType> = {
  login: LoginScreen,
  // Patient
  "paciente-home": PacienteHome,
  "paciente-tratamentos": PacienteTratamentosLista,
  "paciente-tratamento-detalhe": PacienteTratamentoDetalhe,
  "paciente-anamnese": PacienteAnamneseView,
  // Shared
  "tipos-tratamento": TiposTratamentoScreen,
  "tipo-tratamento-detalhe": TipoTratamentoDetalheScreen,
  // Dentist
  "dentista-home": DentistaHome,
  "dentista-pacientes": DentistaPacientesLista,
  "dentista-paciente-detalhe": DentistaPacienteDetalhe,
  "dentista-tratamentos": DentistaTratamentosLista,
  "dentista-tratamento-detalhe": DentistaTratamentoDetalhe,
  "dentista-anamnese-nova": DentistaAnamneseForm,
  "dentista-anamnese-view": DentistaAnamneseView,
  "dentista-novo-tratamento": DentistaNovoTratamento,
  "dentista-pacientes-tratamentos": DentistaPacientesTratamentos,
}

export function AppRouter() {
  const { screen } = useApp()
  const ScreenComponent = screens[screen] || LoginScreen

  return <ScreenComponent />
}
