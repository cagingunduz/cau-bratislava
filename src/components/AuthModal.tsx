'use client'
import { useState } from 'react'
import { createClient } from '@/lib/auth'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface Props { onClose: () => void }

type Mode = 'signin' | 'signup'

export default function AuthModal({ onClose }: Props) {
  const [mode, setMode]       = useState<Mode>('signin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [err, setErr]         = useState('')
  const [success, setSuccess] = useState('')
  const isMobile = useMediaQuery('(max-width: 480px)')

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setSuccess('')

    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) { setErr(error.message); return }
      window.location.href = '/account'
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) { setErr(error.message); return }
      window.location.href = '/account'
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const inputStyle: React.CSSProperties = {
    padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 6,
    fontSize: 14, color: '#0a0a0a', background: '#fff', outline: 'none',
    width: '100%', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .2s',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 12 : 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 420, padding: isMobile ? '28px 18px 22px' : 36, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 18, right: 18, width: 34, height: 34, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#707070' }}
        >✕</button>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, letterSpacing: '-.02em' }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 24, margin: '0 0 24px' }}>
          {mode === 'signin' ? 'Sign in to save favorites and manage your listings.' : 'Join the Erasmus marketplace.'}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{ width: '100%', padding: '11px 16px', background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: googleLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'border-color .2s', marginBottom: 18, opacity: googleLoading ? .7 : 1 }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"/></svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
          <span style={{ fontSize: 12, color: '#a0a0a0', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
        </div>

        {/* Email + password */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
          />

          {err     && <p style={{ margin: 0, fontSize: 13, color: '#e63946' }}>{err}</p>}
          {success && <p style={{ margin: 0, fontSize: 13, color: '#16a34a' }}>{success}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1, transition: 'opacity .2s' }}
          >
            {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {/* Mode toggle */}
        <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: 13, color: '#a0a0a0' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErr(''); setSuccess('') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#0a0a0a', padding: 0, fontFamily: 'inherit' }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
