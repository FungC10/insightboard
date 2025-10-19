import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'InsightBoard - Crypto Market Dashboard',
  description: 'A modern crypto market dashboard providing real-time data, interactive charts, and comprehensive market insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
