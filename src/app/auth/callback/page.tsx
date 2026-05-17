'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/auth'

export default function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) { window.location.href = '/'; return }

    createClient()
      .auth.exchangeCodeForSession(code)
      .then(() => { window.location.href = '/account' })
      .catch(() => { window.location.href = '/' })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#a0a0a0', fontSize: 14 }}>
      Signing in...
    </div>
  )
}
