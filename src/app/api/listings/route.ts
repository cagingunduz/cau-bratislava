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
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'all'
  const maxPrice = searchParams.get('maxPrice')
  const q        = searchParams.get('q')

  let query = db()
    .from('listings')
    .select('*')
    .eq('is_sold', false)
    .order('created_at', { ascending: false })

  if (category !== 'all') query = query.eq('category', category)
  if (maxPrice)           query = query.lte('price', Number(maxPrice))
  if (q)                  query = query.ilike('title', `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await db()
    .from('listings')
    .insert([{ ...body, is_sold: false }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
