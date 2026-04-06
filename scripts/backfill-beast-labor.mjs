import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nwlyteyrvldqnimmhnvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHl0ZXlydmxkcW5pbW1obnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzMjMxNCwiZXhwIjoyMDkwOTA4MzE0fQ.JgIrIx9D3AK5cU8Wgxd34hdWhawYU3B8RXBIHEnVfDE'
)

const updates = [
  { id: '5a4d9246-cf07-4ef4-888c-592ae0b68200', labor_cost: 100 },  // 7/2/2024 Brake Service
  { id: 'edb63a26-5ccb-4199-9ed4-0bd942665e43', labor_cost: 75  },  // 6/25/2024 Brake Service + Safety Check
  { id: '00bed7ca-5165-400f-b77c-31d275e396fb', labor_cost: 150 },  // 4/6/2024 Suspension Service
]

for (const update of updates) {
  const { error } = await supabase
    .from('service_records')
    .update({ labor_cost: update.labor_cost })
    .eq('id', update.id)

  if (error) {
    console.log(`❌ Failed: ${update.id}: ${error.message}`)
  } else {
    console.log(`✅ Updated: $${update.labor_cost} labor cost set`)
  }
}

console.log('\n🏁 Done!')
