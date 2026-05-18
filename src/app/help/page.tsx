'use client'
import { useState, useRef, useEffect } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { useMediaQuery } from '@/lib/useMediaQuery'

const TASKS = [
  { id: 'bank',       label: 'Open Slovak bank account',   est: '2 days',  done: true },
  { id: 'police',     label: 'Register with police',        est: '1 day',   done: true },
  { id: 'insurance',  label: 'Get health insurance',        est: 'today',   done: false, inProgress: true },
  { id: 'residence',  label: 'Apply for residence permit',  est: '~5 days', done: false },
  { id: 'university', label: 'Register at university',      est: '~1 day',  done: false },
]

interface Msg { from: 'user' | 'petra'; text: string; time: string }

function petraReply(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('bank'))
    return 'To open a Slovak bank account, bring your passport + proof of address to Tatra Banka or SLSP. Both offer free student accounts. Takes about 30 minutes — no appointment needed.'
  if (m.includes('police') || m.includes('registr'))
    return 'For police registration, head to the District Foreign Police Office at Hviezdoslavovo nám. 6. Bring: passport, rental contract, 2 passport photos. Processing takes 1–3 days. You can book an appointment at cudzinci.sk.'
  if (m.includes('insurance') || m.includes('health'))
    return 'EU/EEA students: your EHIC card covers emergencies in Slovakia. For full coverage (GP, dental, etc.) consider UNIQA student plans from €15/month — highly recommended for long stays.'
  if (m.includes('residence') || m.includes('permit'))
    return 'For stays over 90 days, you need a Temporary Residence Permit. Apply at the Foreign Police with: passport, proof of accommodation, health insurance, and university enrollment confirmation. Allow 2–4 weeks.'
  if (m.includes('university') || m.includes('enrol') || m.includes('school') || m.includes('faculty'))
    return "Contact your faculty's International Relations Office with your Erasmus acceptance letter. They'll register you for courses. Most faculties require this within the first 2 weeks of arrival."
  if (m.includes('document') || m.includes('what') || m.includes('help') || m.includes('start'))
    return "I can help with:\n• 🏦 Opening a bank account\n• 👮 Police registration\n• 🏥 Health insurance\n• 📋 Residence permit\n• 🎓 University enrollment\n\nWhat do you need help with first?"
  if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('ahoj'))
    return "Hi! I'm Petra, your Bratislava setup guide. What do you need help with today — banking, police registration, insurance, residence permit, or university enrollment?"
  return "I'm here to help with your Bratislava setup! Ask me about banking, police registration, health insurance, residence permits, or university enrollment."
}

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function HelpPage() {
  const [tasks, setTasks] = useState(TASKS)
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'petra', text: "Hi! I'm Petra, your Bratislava setup guide 👋\nWhat do you need help with today?", time: '10:24' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 820px)')

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length

  useEffect(() => {
    const messagesEl = messagesRef.current
    if (!messagesEl) return
    messagesEl.scrollTop = messagesEl.scrollHeight
  }, [msgs, typing])

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, inProgress: false } : t))
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    const t = now()
    setMsgs(prev => [...prev, { from: 'user', text, time: t }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(prev => [...prev, { from: 'petra', text: petraReply(text), time: now() }])
    }, 900 + Math.random() * 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'inherit' }}>
      <SiteHeader />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '32px 16px 56px' : '48px 28px 80px' }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a0a0a0' }}>Paperwork</p>
        <h1 style={{ margin: '0 0 6px', fontFamily: "'Lora',Georgia,serif", fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 400 }}>
          Your setup plan
        </h1>
        <p style={{ margin: '0 0 36px', fontSize: 13, color: '#a0a0a0' }}>Personalized for: Erasmus in Bratislava · Spring 2026</p>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 24, alignItems: 'start' }}>
          {/* Checklist */}
          <div>
            <div style={{ background: '#fff', border: '1.5px solid #ececec', borderRadius: 12, overflow: 'hidden' }}>
              {/* Progress bar */}
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Checklist</span>
                  <span style={{ fontSize: 13, color: '#888' }}>{done} of {total} done</span>
                </div>
                <div style={{ height: 4, background: '#f0f0f0', borderRadius: 100 }}>
                  <div style={{ height: '100%', background: '#16a34a', borderRadius: 100, width: `${(done / total) * 100}%`, transition: 'width .4s' }} />
                </div>
              </div>

              {/* Tasks */}
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: isMobile ? '16px' : '16px 24px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: task.done ? '#16a34a' : '#fff',
                    border: task.done ? '2px solid #16a34a' : '2px solid #ccc',
                    transition: 'all .2s',
                  }}>
                    {task.done && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: task.done ? '#a0a0a0' : '#0a0a0a', textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.label}
                    </p>
                    {task.inProgress && !task.done && (
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>In progress · {task.est}</p>
                    )}
                  </div>

                  <span style={{ fontSize: 12, color: '#c0c0c0', flexShrink: 0 }}>{task.est}</span>
                </div>
              ))}
            </div>

            {/* Guide sections */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '🏦', title: 'Bank account', desc: 'Tatra Banka or SLSP — free student account, takes 30 min.' },
                { icon: '👮', title: 'Police registration', desc: 'Hviezdoslavovo nám. 6 · passport + rental contract + 2 photos.' },
                { icon: '🏥', title: 'Health insurance', desc: 'EHIC for emergencies, UNIQA student plan from €15/mo for full cover.' },
              ].map(item => (
                <div key={item.icon} style={{ background: '#fafafa', border: '1px solid #ececec', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700 }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Petra chat */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: isMobile ? 500 : 540, position: isMobile ? 'static' : 'sticky', top: 80 }}>
            {/* Chat header */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>P</div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>Petra</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,.45)' }}>● Your ČAU guide</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {msgs.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'petra' ? 'flex-start' : 'flex-end' }}>
                  {msg.from === 'petra' && (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#7c3aed', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>P</div>
                  )}
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px', borderRadius: msg.from === 'petra' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                    background: msg.from === 'petra' ? 'rgba(255,255,255,.08)' : '#7c3aed',
                    color: '#fff', fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  }}>{msg.text}</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>{msg.time}</span>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#7c3aed', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                  <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: '0 10px 10px 10px', padding: '10px 14px', display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.4)', animation: `bounce .9s ${i * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
              />
              <button type="submit" disabled={!input.trim()} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: input.trim() ? 'pointer' : 'default', fontFamily: 'inherit', opacity: input.trim() ? 1 : .5 }}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}
