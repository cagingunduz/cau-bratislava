'use client'
import { useState } from 'react'
import { createClient } from '@/lib/auth'

interface Props { onClose: () => void; onSuccess?: () => void }

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) { setErr(error.message); return }
    setSent(true)
    onSuccess?.()
  }

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px', border: '1.5px solid #e0e0e0', borderRadius: 6,
    fontSize: 15, color: '#0a0a0a', background: '#fff', outline: 'none',
    width: '100%', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 420, padding: 40, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', color: '#707070', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
        >✕</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check your inbox</h2>
            <p style={{ fontSize: 14, color: '#707070' }}>We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, letterSpacing: '-.02em' }}>Sign in</h2>
            <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 28 }}>No password needed — we send a magic link.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
              />
              {err && <p style={{ fontSize: 13, color: '#e63946', margin: 0 }}>{err}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '13px', background: '#0a0a0a', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '.04em', border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
