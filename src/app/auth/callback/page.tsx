'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/auth'

export default function AuthCallback() {
  useEffect(() => {
    const supabase = createClient()
    // detectSessionInUrl:true → SDK reads token from URL hash automatically
    supabase.auth.getSession().then(({ data }) => {
      window.location.href = data.session ? '/account' : '/'
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#a0a0a0', fontSize: 14 }}>
      Signing in...
    </div>
  )
}
