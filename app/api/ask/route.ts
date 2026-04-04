import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const { question } = await request.json()

  const { data: bikes } = await supabaseAdmin.from('bikes').select('*').order('name')
  const { data: records } = await supabaseAdmin
    .from('service_records')
    .select('*, bikes(name), service_files(file_name, file_type)')
    .order('date', { ascending: false })

  const bikeList = (bikes || []).map(b => `- ${b.name} (${b.status})`).join('\n')

  const recordList = (records || []).map(r => {
    const bikeName = (r.bikes as { name: string } | null)?.name || 'Unknown'
    const parts = (r.parts || []).map((p: { name: string; brand?: string; cost?: number }) =>
      `${p.name}${p.brand ? ` (${p.brand})` : ''}${p.cost ? ` - $${p.cost}` : ''}`
    ).join(', ')
    return [
      `Bike: ${bikeName}`,
      `Date: ${r.date}`,
      `Service: ${r.service_type}`,
      r.mileage ? `Mileage: ${r.mileage}` : null,
      r.description ? `Description: ${r.description}` : null,
      r.performed_by ? `Performed by: ${r.performed_by}` : null,
      parts ? `Parts: ${parts}` : null,
      r.total_cost ? `Total cost: $${r.total_cost}` : null,
      r.notes ? `Notes: ${r.notes}` : null,
    ].filter(Boolean).join('\n')
  }).join('\n---\n')

  const systemPrompt = `You are a helpful bike maintenance assistant for a personal bike fleet.
Answer questions about service history, maintenance records, and bike status based on the data below.
Be concise and direct. If no records match, say so clearly.

FLEET:
${bikeList || 'No bikes yet'}

SERVICE RECORDS:
${recordList || 'No service records yet'}`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  })

  const answer = message.content[0].type === 'text'
    ? message.content[0].text
    : 'Unable to generate a response.'

  return NextResponse.json({ answer })
}
