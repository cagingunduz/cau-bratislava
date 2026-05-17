'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Listing } from '@/types'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/auth'
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
import AuthModal from '@/components/AuthModal'
import ChatModal from '@/components/ChatModal'

const MapModal = dynamic(() => import('@/components/MapModal'), { ssr: false })

export default function Home() {
  const [listings, setListings]         = useState<Listing[]>([])
  const [loading, setLoading]           = useState(true)
  const [category, setCategory]         = useState('all')
  const [maxPrice, setMaxPrice]         = useState('all')
  const [searchQ, setSearchQ]           = useState('')
  const [showSold, setShowSold]         = useState(false)
  const [sellOpen, setSellOpen]         = useState(false)
  const [contactItem, setContactItem]   = useState<Listing | null>(null)
  const [chatItem, setChatItem]         = useState<Listing | null>(null)
  const [mapOpen, setMapOpen]           = useState(false)
  const [authOpen, setAuthOpen]         = useState(false)
  const [toast, setToast]               = useState<string | null>(null)
  const [user, setUser]                 = useState<User | null>(null)
  const [favoriteIds, setFavoriteIds]   = useState<Set<string>>(new Set())

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Auth setup
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      // Only redirect to account when coming from OAuth (hash/query contains token)
      if (event === 'SIGNED_IN' && session && (window.location.hash || window.location.search.includes('code'))) {
        window.location.href = '/account'
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load favorites when user logs in
  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return }
    const supabase = createClient()
    Promise.resolve(supabase.from('favorites').select('listing_id').eq('user_id', user.id))
      .then(({ data }) => setFavoriteIds(new Set(data?.map((f: { listing_id: string }) => f.listing_id) ?? [])))
      .catch(() => {})
  }, [user])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (category !== 'all') p.set('category', category)
      if (maxPrice !== 'all') p.set('maxPrice', maxPrice)
      if (searchQ)            p.set('q', searchQ)
      if (showSold)           p.set('showSold', 'true')
      const res  = await fetch(`/api/listings?${p}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch { setListings([]) }
    finally  { setLoading(false) }
  }, [category, maxPrice, searchQ, showSold])

  useEffect(() => { fetchListings() }, [fetchListings])

  async function handleSell(body: Record<string, unknown>) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (user) headers['x-user-id'] = user.id

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...body, user_id: user?.id ?? null }),
    })
    if (res.ok) {
      setSellOpen(false)
      showToast('Your listing is live! 🎉')
      fetchListings()
    } else {
      showToast('Something went wrong. Try again.')
    }
  }

  async function handleContact(sender: { name: string; email: string; message: string }) {
    if (!contactItem) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: contactItem.id,
        sender_name: sender.name,
        sender_email: sender.email,
        message: sender.message,
      }),
    })
    if (res.ok) {
      setContactItem(null)
      showToast('Message sent! The seller will reply soon.')
    } else {
      showToast('Something went wrong. Try again.')
    }
  }

  async function handleToggleFavorite(listing: Listing) {
    if (!user) { setAuthOpen(true); return }
    const isFav = favoriteIds.has(listing.id)

    setFavoriteIds(prev => {
      const next = new Set(prev)
      isFav ? next.delete(listing.id) : next.add(listing.id)
      return next
    })

    const supabase = createClient()
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listing.id)
    } else {
      await supabase.from('favorites').upsert({ user_id: user.id, listing_id: listing.id })
    }
  }

  async function handleMarkSold(listing: Listing) {
    if (!user) return
    const res = await fetch(`/api/listings/${listing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
      body: JSON.stringify({ is_sold: true }),
    })
    if (res.ok) { showToast('Marked as sold!'); fetchListings() }
  }

  async function handleDelete(listing: Listing) {
    if (!user) return
    if (!confirm(`Delete "${listing.title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/listings/${listing.id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': user.id },
    })
    if (res.ok) { showToast('Listing deleted.'); fetchListings() }
  }

  async function handleSignOut() {
    await createClient().auth.signOut()
    setUser(null)
    showToast('Signed out.')
  }

  const chatUser = user
    ? { email: user.email!, name: user.email!.split('@')[0] }
    : null

  return (
    <>
      <Header
        onSell={() => setSellOpen(true)}
        onSearch={setSearchQ}
        onSignIn={() => setAuthOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />
      <main>
        <Hero onSell={() => setSellOpen(true)} />
        <ListingsSection
          listings={listings}
          loading={loading}
          category={category}
          maxPrice={maxPrice}
          showSold={showSold}
          favoriteIds={favoriteIds}
          currentUserId={user?.id}
          onCategoryChange={setCategory}
          onMaxPriceChange={setMaxPrice}
          onShowSoldChange={setShowSold}
          onContact={setContactItem}
          onChat={l => { if (!user) { setAuthOpen(true); return } setChatItem(l) }}
          onToggleFavorite={handleToggleFavorite}
          onMarkSold={handleMarkSold}
          onDelete={handleDelete}
          onMapOpen={() => setMapOpen(true)}
        />
        <HowItWorks />
        <CtaBanner onSell={() => setSellOpen(true)} />
        <Testimonials />
      </main>
      <Footer />

      {sellOpen    && <SellModal onClose={() => setSellOpen(false)} onSubmit={handleSell} />}
      {contactItem && <ContactModal listing={contactItem} onClose={() => setContactItem(null)} onSubmit={handleContact} />}
      {authOpen    && <AuthModal onClose={() => setAuthOpen(false)} />}
      {mapOpen     && <MapModal listings={listings} onClose={() => setMapOpen(false)} onContact={l => { setMapOpen(false); setContactItem(l) }} />}
      {chatItem    && chatUser && (
        <ChatModal
          listing={chatItem}
          currentEmail={chatUser.email}
          currentName={chatUser.name}
          onClose={() => setChatItem(null)}
        />
      )}

      <Toast message={toast} />
    </>
  )
}
