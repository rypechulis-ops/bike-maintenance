import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bikeId = searchParams.get('bike_id')

  let query = supabaseAdmin
    .from('service_records')
    .select('*, bikes(name), service_files(*)')
    .order('date', { ascending: false })

  if (bikeId) query = query.eq('bike_id', bikeId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const formData = await request.formData()

  const bike_id = formData.get('bike_id') as string
  const date = formData.get('date') as string
  const mileage = formData.get('mileage') as string
  const time_spent = formData.get('time_spent') as string
  const service_type = formData.get('service_type') as string
  const description = formData.get('description') as string
  const performed_by = formData.get('performed_by') as string
  const partsRaw = formData.get('parts') as string
  const total_cost = formData.get('total_cost') as string
  const notes = formData.get('notes') as string
  const files = formData.getAll('files') as File[]

  const parts = partsRaw ? JSON.parse(partsRaw) : []

  const { data: record, error } = await supabaseAdmin
    .from('service_records')
    .insert({
      bike_id,
      date,
      mileage: mileage ? parseInt(mileage) : null,
      time_spent: time_spent ? parseFloat(time_spent) : null,
      labor_cost: time_spent ? parseFloat((parseFloat(time_spent) * 50).toFixed(2)) : null,
      service_type,
      description: description || null,
      performed_by: performed_by || null,
      parts,
      total_cost: total_cost ? parseFloat(total_cost) : null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const validFiles = files.filter(f => f.size > 0)
  for (const file of validFiles) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const filePath = `${record.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('service-files')
      .upload(filePath, buffer, { contentType: file.type })

    if (!uploadError) {
      await supabaseAdmin.from('service_files').insert({
        service_record_id: record.id,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
      })
    }
  }

  return NextResponse.json(record)
}
