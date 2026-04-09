import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'ProtRisk - Sistema Odontológico',
  description: 'Sistema de gerenciamento odontológico para pacientes e dentistas',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a7a66',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} font-sans antialiased min-h-screen bg-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
