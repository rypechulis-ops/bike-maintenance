import { supabaseAdmin } from '@/lib/supabase-admin'
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

  const bikeList = (bikes || []).map(b => `- ${b.name} (id: ${b.id}, status: ${b.status})`).join('\n')

  const recordList = (records || []).map(r => {
    const bikeName = (r.bikes as { name: string } | null)?.name || 'Unknown'
    const parts = (r.parts || []).map((p: { name: string; brand?: string; cost?: number }) =>
      `${p.name}${p.brand ? ` (${p.brand})` : ''}${p.cost ? ` - $${p.cost}` : ''}`
    ).join(', ')
    return [
      `Record ID: ${r.id}`,
      `Bike: ${bikeName}`,
      `Date: ${r.date || 'unknown'}`,
      `Service: ${r.service_type}`,
      r.mileage ? `Mileage: ${r.mileage}` : null,
      r.description ? `Description: ${r.description}` : null,
      r.performed_by ? `Performed by: ${r.performed_by}` : null,
      parts ? `Parts: ${parts}` : null,
      r.time_spent ? `Time spent: ${r.time_spent} hours` : null,
      r.labor_cost ? `Labor cost: $${r.labor_cost} (@ $50/hr)` : null,
      r.total_cost ? `Parts/other cost: $${r.total_cost}` : null,
      (r.labor_cost && r.total_cost) ? `Total cost: $${(parseFloat(r.labor_cost) + parseFloat(r.total_cost)).toFixed(2)}` : null,
      r.notes ? `Notes: ${r.notes}` : null,
    ].filter(Boolean).join('\n')
  }).join('\n---\n')

  const tools: Anthropic.Tool[] = [
    {
      name: 'update_service_record',
      description: 'Update fields on an existing service record. Use the Record ID from the service records data.',
      input_schema: {
        type: 'object' as const,
        properties: {
          record_id: { type: 'string', description: 'The UUID of the service record to update' },
          labor_cost: { type: 'number', description: 'Labor cost in dollars' },
          time_spent: { type: 'number', description: 'Time spent in hours' },
          total_cost: { type: 'number', description: 'Parts/other cost in dollars' },
          notes: { type: 'string', description: 'Notes to add or update' },
          performed_by: { type: 'string', description: 'Who performed the service' },
          mileage: { type: 'number', description: 'Mileage at time of service' },
        },
        required: ['record_id'],
      },
    },
    {
      name: 'update_bike',
      description: 'Update fields on a bike (e.g. retire it, change its name).',
      input_schema: {
        type: 'object' as const,
        properties: {
          bike_id: { type: 'string', description: 'The UUID of the bike to update' },
          status: { type: 'string', enum: ['active', 'retired'], description: 'Active or retired status' },
          name: { type: 'string', description: 'New name for the bike' },
          notes: { type: 'string', description: 'Notes about the bike' },
        },
        required: ['bike_id'],
      },
    },
  ]

  const systemPrompt = `You are a helpful bike maintenance assistant for a personal bike fleet.
You can answer questions AND make updates to service records and bikes when asked.
Be concise and direct. If no records match, say so clearly.
Labor rate is $50/hour for all mechanics. When asked about costs, use the labor_cost and parts/other cost fields. If only time_spent is available, calculate labor as time_spent x $50.
When the user asks you to update something, use the appropriate tool. Always confirm what you updated.

FLEET:
${bikeList || 'No bikes yet'}

SERVICE RECORDS:
${recordList || 'No service records yet'}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages: [{ role: 'user', content: question }],
  })

  // Handle tool use
  if (response.stop_reason === 'tool_use') {
    const toolUseBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      return NextResponse.json({ answer: 'Something went wrong processing your request.' })
    }

    const toolName = toolUseBlock.name
    const input = toolUseBlock.input as Record<string, unknown>
    let updateResult = ''

    if (toolName === 'update_service_record') {
      const { record_id, ...fields } = input
      const { error } = await supabaseAdmin
        .from('service_records')
        .update(fields)
        .eq('id', record_id)

      updateResult = error ? `Failed to update: ${error.message}` : 'Record updated successfully.'
    } else if (toolName === 'update_bike') {
      const { bike_id, ...fields } = input
      const { error } = await supabaseAdmin
        .from('bikes')
        .update(fields)
        .eq('id', bike_id)

      updateResult = error ? `Failed to update: ${error.message}` : 'Bike updated successfully.'
    }

    // Get a natural language confirmation from Claude
    const followUp = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      tools,
      messages: [
        { role: 'user', content: question },
        { role: 'assistant', content: response.content },
        {
          role: 'user', content: [{
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: updateResult,
          }],
        },
      ],
    })

    const answer = followUp.content.find(b => b.type === 'text')
    return NextResponse.json({ answer: answer?.type === 'text' ? answer.text : updateResult })
  }

  const answer = response.content.find(b => b.type === 'text')
  return NextResponse.json({ answer: answer?.type === 'text' ? answer.text : 'Unable to generate a response.' })
}
