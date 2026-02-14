import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'

import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '900']
})

export const metadata: Metadata = {
  title: 'ProtRisk - Sistema Odontologico',
  description: 'Sistema de gerenciamento odontologico para pacientes e dentistas',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans antialiased max-w-[430px] mx-auto min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  )
}
