import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: NextRequest, ctx: RouteContext<'/api/conversations/[id]/messages'>) {
  const { id } = await ctx.params
  const { sender_email, sender_name, content } = await req.json()

  const { data, error } = await db()
    .from('chat_messages')
    .insert({ conversation_id: id, sender_email, sender_name, content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
