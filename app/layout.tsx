import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from './providers'

export const metadata: Metadata = {
  title: 'InsightBoard',
  description: 'A crypto market dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
