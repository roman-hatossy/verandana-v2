import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Verandana',
  description: 'Zapytanie ofertowe Verandana'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  )
}
