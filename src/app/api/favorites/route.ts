import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json([], { status: 200 })

  const { data, error } = await db()
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.map(f => f.listing_id) ?? [])
}

export async function POST(req: NextRequest) {
  const { listing_id, user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { error } = await db()
    .from('favorites')
    .upsert({ user_id, listing_id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { listing_id, user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { error } = await db()
    .from('favorites')
    .delete()
    .eq('user_id', user_id)
    .eq('listing_id', listing_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
