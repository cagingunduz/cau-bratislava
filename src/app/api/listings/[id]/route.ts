import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/listings/[id]'>) {
  const { id } = await ctx.params
  const body = await req.json()
  const userId = req.headers.get('x-user-id')

  const query = db().from('listings').update(body).eq('id', id)
  if (userId) query.eq('user_id', userId)

  const { data, error } = await query.select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/listings/[id]'>) {
  const { id } = await ctx.params
  const userId = req.headers.get('x-user-id')

  const query = db().from('listings').delete().eq('id', id)
  if (userId) query.eq('user_id', userId)

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
