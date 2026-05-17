'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) { router.replace('/'); return }

    createClient()
      .auth.exchangeCodeForSession(code)
      .then(() => {
        router.replace('/')
        router.refresh()
      })
      .catch(() => router.replace('/'))
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#a0a0a0', fontSize: 14 }}>
      Signing in...
    </div>
  )
}
