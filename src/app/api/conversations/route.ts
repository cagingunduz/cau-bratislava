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
  const listing_id  = searchParams.get('listing_id')
  const buyer_email = searchParams.get('buyer_email')

  if (!listing_id || !buyer_email) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const { data, error } = await db()
    .from('conversations')
    .select('*, chat_messages(*)')
    .eq('listing_id', listing_id)
    .eq('buyer_email', buyer_email)
    .order('created_at', { foreignTable: 'chat_messages', ascending: true })
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { listing_id, buyer_email, buyer_name, content } = await req.json()

  const supabase = db()

  // upsert conversation
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .upsert({ listing_id, buyer_email, buyer_name }, { onConflict: 'listing_id,buyer_email' })
    .select()
    .single()

  if (convErr) return NextResponse.json({ error: convErr.message }, { status: 500 })

  // insert first message
  const { data: msg, error: msgErr } = await supabase
    .from('chat_messages')
    .insert({ conversation_id: conv.id, sender_email: buyer_email, sender_name: buyer_name, content })
    .select()
    .single()

  if (msgErr) return NextResponse.json({ error: msgErr.message }, { status: 500 })
  return NextResponse.json({ conversation: conv, message: msg }, { status: 201 })
}
