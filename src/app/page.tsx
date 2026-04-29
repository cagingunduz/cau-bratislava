'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Listing } from '@/types'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ListingsSection from '@/components/ListingsSection'
import HowItWorks from '@/components/HowItWorks'
import CtaBanner from '@/components/CtaBanner'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import SellModal from '@/components/SellModal'
import ContactModal from '@/components/ContactModal'
import Toast from '@/components/Toast'

export default function Home() {
  const [listings, setListings]       = useState<Listing[]>([])
  const [loading, setLoading]         = useState(true)
  const [category, setCategory]       = useState('all')
  const [maxPrice, setMaxPrice]       = useState('all')
  const [searchQ, setSearchQ]         = useState('')
  const [sellOpen, setSellOpen]       = useState(false)
  const [contactItem, setContactItem] = useState<Listing | null>(null)
  const [toast, setToast]             = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (category !== 'all') p.set('category', category)
      if (maxPrice !== 'all') p.set('maxPrice', maxPrice)
      if (searchQ)            p.set('q', searchQ)
      const res  = await fetch(`/api/listings?${p}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch { setListings([]) }
    finally  { setLoading(false) }
  }, [category, maxPrice, searchQ])

  useEffect(() => { fetchListings() }, [fetchListings])

  async function handleSell(body: Record<string, unknown>) {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) { setSellOpen(false); showToast('Your listing is live! 🎉'); fetchListings() }
    else          showToast('Something went wrong. Try again.')
  }

  async function handleContact(sender: { name: string; email: string; message: string }) {
    if (!contactItem) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: contactItem.id, sender_name: sender.name, sender_email: sender.email, message: sender.message }),
    })
    if (res.ok) { setContactItem(null); showToast('Message sent! The seller will reply soon.') }
    else          showToast('Something went wrong. Try again.')
  }

  return (
    <>
      <Header onSell={() => setSellOpen(true)} onSearch={setSearchQ} />
      <main>
        <Hero onSell={() => setSellOpen(true)} />
        <ListingsSection
          listings={listings}
          loading={loading}
          category={category}
          maxPrice={maxPrice}
          onCategoryChange={setCategory}
          onMaxPriceChange={setMaxPrice}
          onContact={setContactItem}
        />
        <HowItWorks />
        <CtaBanner onSell={() => setSellOpen(true)} />
        <Testimonials />
      </main>
      <Footer />

      {sellOpen   && <SellModal    onClose={() => setSellOpen(false)}   onSubmit={handleSell} />}
      {contactItem && <ContactModal listing={contactItem} onClose={() => setContactItem(null)} onSubmit={handleContact} />}
      <Toast message={toast} />
    </>
  )
}
