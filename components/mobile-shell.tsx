"use client"

import { useApp } from "@/lib/store"
import { ArrowLeft } from "lucide-react"

interface MobileShellProps {
  title: string
  children: React.ReactNode
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function MobileShell({ title, children, showBack = true, rightAction }: MobileShellProps) {
  const { goBack } = useApp()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shadow-md">
        {showBack && (
          <button
            onClick={goBack}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold flex-1 truncate">{title}</h1>
        {rightAction && <div>{rightAction}</div>}
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
