"use client"

import { useState, useEffect } from "react"
import { useApp, type Paciente, type Dentista } from "@/lib/store"
import {
  ArrowLeft,
  Menu,
  X,
  Home,
  ClipboardList,
  Users,
  BookOpen,
  FileText,
  Plus,
  CheckCircle2,
  LogOut,
  Shield,
  Star,
} from "lucide-react"

interface NavItem {
  label: string
  icon: typeof Home
  screen: string
  params?: Record<string, string>
}

const pacienteNav: NavItem[] = [
  { label: "Início", icon: Home, screen: "paciente-home" },
  { label: "Meus Tratamentos", icon: ClipboardList, screen: "paciente-tratamentos", params: { filtro: "em_andamento" } },
  { label: "Minha Anamnese", icon: FileText, screen: "paciente-anamnese" },
  { label: "Tipos de Tratamento", icon: BookOpen, screen: "tipos-tratamento" },
]

const dentistaNav: NavItem[] = [
  { label: "Início", icon: Home, screen: "dentista-home" },
  { label: "Pacientes", icon: Users, screen: "dentista-pacientes" },
  { label: "Tratamentos", icon: ClipboardList, screen: "dentista-tratamentos", params: { filtro: "em_andamento" } },
  { label: "Nova Anamnese", icon: Plus, screen: "dentista-anamnese-nova" },
  { label: "Em Tratamento", icon: FileText, screen: "dentista-pacientes-tratamentos" },
  { label: "Finalizados", icon: CheckCircle2, screen: "dentista-pacientes-finalizados" },
  { label: "Tipos de Tratamento", icon: BookOpen, screen: "tipos-tratamento" },
  { label: "Recomendações", icon: Star, screen: "dentista-tratamentos", params: { filtro: "recomendacao" } },
]

interface MobileShellProps {
  title: string
  children: React.ReactNode
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function MobileShell({ title, children, showBack = true, rightAction }: MobileShellProps) {
  const { role, currentUser, screen, navigate, goBack, logout } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navItems = role === "paciente" ? pacienteNav : dentistaNav
  const userName = currentUser && "nome" in currentUser ? currentUser.nome : ""
  const userSub =
    currentUser && role === "dentista" && "cro" in currentUser
      ? (currentUser as Dentista).cro
      : currentUser && role === "paciente" && "cpf" in currentUser
        ? (currentUser as Paciente).cpf
        : ""

  useEffect(() => {
    setDrawerOpen(false)
  }, [screen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const isActive = (item: NavItem) => {
    if (item.screen === screen) {
      if (item.params) {
        return true
      }
      return true
    }
    return false
  }

  const handleNav = (item: NavItem) => {
    navigate(item.screen, item.params)
    setDrawerOpen(false)
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-[280px]" : "w-[260px]"}`}>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground tracking-tight">ProtRisk</p>
          <p className="text-[10px] text-sidebar-foreground/50 font-medium">Sistema Odontológico</p>
        </div>
        {mobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <button
              key={`${item.screen}-${item.params?.filtro ?? ""}`}
              onClick={() => handleNav(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/80">
            <span className="text-xs font-bold">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-[10px] text-sidebar-foreground/50">{userSub}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout()
            setDrawerOpen(false)
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 inset-y-0 bg-[hsl(var(--sidebar-background))] shadow-2xl animate-slide-in">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-8 h-14 bg-card/80 backdrop-blur-md border-b border-border">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {showBack && (
            <button
              onClick={goBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <h1 className="text-base lg:text-lg font-semibold text-foreground flex-1 truncate">
            {title}
          </h1>

          {rightAction && <div>{rightAction}</div>}
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
