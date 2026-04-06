import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nwlyteyrvldqnimmhnvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHl0ZXlydmxkcW5pbW1obnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzMjMxNCwiZXhwIjoyMDkwOTA4MzE0fQ.JgIrIx9D3AK5cU8Wgxd34hdWhawYU3B8RXBIHEnVfDE'
)

const HOURLY_RATE = 50

// Each entry: match by bike name + service_type + date, set time_spent in hours
const laborData = [
  { bike: 'BEAST',          date: '2023-05-26', service_type: 'Brake Service',                                    time_spent: 1.00 },
  { bike: 'Son of Bob II',  date: '2023-05-26', service_type: 'Wheel Service',                                    time_spent: 0.25 },
  { bike: 'Son of Bob II',  date: '2023-10-14', service_type: 'Fork Install + Ebike Conversion',                  time_spent: 0.50 },
  { bike: 'Son of Bob II',  date: '2023-10-27', service_type: 'Brake Bed-in + Drivetrain + Safety Check',         time_spent: 0.50 },
  { bike: 'Spider Gwen',    date: '2023-08-12', service_type: 'Drivetrain Service',                               time_spent: 0.25 },
  { bike: 'Marine E Rift',  date: '2023-08-12', service_type: 'Fork Install + Brake Service + Drivetrain Service',time_spent: 4.50 },
  { bike: 'BEAST',          date: '2024-01-27', service_type: 'Brake Service',                                    time_spent: 3.25 },
  { bike: 'Son of Bob II',  date: '2024-03-08', service_type: 'Brake Install + Tune-up',                          time_spent: 1.25 },
  { bike: 'BEAST',          date: '2024-03-08', service_type: 'Brake Install',                                    time_spent: 1.25 },
  { bike: 'Spider Gwen',    date: '2024-02-11', service_type: 'General Service + Safety Check',                   time_spent: 0.50 },
  { bike: 'IZIP',           date: '2023-07-06', service_type: 'Wheel True + Brake Service',                       time_spent: 1.00 },
  { bike: 'Marine E Rift',  date: '2024-08-26', service_type: 'Wheel True + Brake Bleed + General Service',       time_spent: 1.50 },
]

const { data: bikes } = await supabase.from('bikes').select('id, name')
const bikeMap = {}
for (const bike of bikes) bikeMap[bike.name] = bike.id

let success = 0
let failed = 0

for (const entry of laborData) {
  const bikeId = bikeMap[entry.bike]
  if (!bikeId) {
    console.log(`❌ Bike not found: "${entry.bike}"`)
    failed++
    continue
  }

  const labor_cost = parseFloat((entry.time_spent * HOURLY_RATE).toFixed(2))

  const { data: records } = await supabase
    .from('service_records')
    .select('id')
    .eq('bike_id', bikeId)
    .eq('date', entry.date)
    .eq('service_type', entry.service_type)

  if (!records || records.length === 0) {
    console.log(`❌ Record not found: ${entry.bike} — ${entry.service_type} (${entry.date})`)
    failed++
    continue
  }

  const { error } = await supabase
    .from('service_records')
    .update({ time_spent: entry.time_spent, labor_cost })
    .eq('id', records[0].id)

  if (error) {
    console.log(`❌ Failed to update: ${entry.bike} — ${entry.service_type}: ${error.message}`)
    failed++
  } else {
    console.log(`✅ Updated: ${entry.bike} — ${entry.service_type} → ${entry.time_spent}hrs = $${labor_cost}`)
    success++
  }
}

console.log(`\n🏁 Done! ${success} updated, ${failed} failed.`)
