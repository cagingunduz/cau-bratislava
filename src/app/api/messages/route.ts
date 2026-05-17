import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = db()

  const { data, error } = await supabase
    .from('messages')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch listing to get seller email
  const { data: listing } = await supabase
    .from('listings')
    .select('title, seller_email, seller_name')
    .eq('id', body.listing_id)
    .single()

  // Send email notification if Resend key is configured
  if (listing && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Čau Bratislava <noreply@caubratislava.com>',
        to: listing.seller_email,
        subject: `New message about "${listing.title}"`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">New message on Čau Bratislava</h2>
            <p style="color:#707070;margin-bottom:24px">Someone is interested in your listing: <strong>${listing.title}</strong></p>
            <div style="background:#f7f7f7;border-radius:8px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 8px"><strong>From:</strong> ${body.sender_name} (${body.sender_email})</p>
              <p style="margin:0;white-space:pre-wrap">${body.message}</p>
            </div>
            <p style="color:#a0a0a0;font-size:13px">Reply directly to <a href="mailto:${body.sender_email}">${body.sender_email}</a></p>
          </div>
        `,
      })
    } catch {
      // Email failure should not block the response
    }
  }

  return NextResponse.json(data, { status: 201 })
}
