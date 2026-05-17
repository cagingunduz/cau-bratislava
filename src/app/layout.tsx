import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Čau Bratislava — Erasmus Platform',
  description: 'Housing, storage, marketplace and paperwork help for Erasmus students in Bratislava.',
  openGraph: {
    title: 'Čau Bratislava — Erasmus Platform',
    description: 'Everything Erasmus students need in Bratislava — housing, storage, marketplace, and setup help.',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;900&family=Lora:ital@1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
