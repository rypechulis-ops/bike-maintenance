import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nwlyteyrvldqnimmhnvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHl0ZXlydmxkcW5pbW1obnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzMjMxNCwiZXhwIjoyMDkwOTA4MzE0fQ.JgIrIx9D3AK5cU8Wgxd34hdWhawYU3B8RXBIHEnVfDE'
)

const { data: bikes } = await supabase.from('bikes').select('id, name')
const bikeMap = {}
for (const bike of bikes) bikeMap[bike.name] = bike.id

// Only the 7 records that failed (no date ones)
const records = [
  {
    bike: 'Spider Gwen',
    date: null,
    service_type: 'Brake Install + General Setup',
    description: 'Installed Tektro Auriga rear brake and routed brake line. Trued rotors front and rear (rear was especially bad). Aligned rear derailleur hanger. Cut chain to length. Adjusted shifting — unlocked largest and smallest sprockets where shifting improved. Adjusted front chain guide. Bedded in brakes. Safety check.',
    performed_by: 'Scotty',
    parts: [{ name: 'Tektro Auriga Rear Brake', brand: 'Tektro' }],
  },
  {
    bike: 'Son of Bob II',
    date: null,
    service_type: 'Brake + Drivetrain Service',
    description: 'Replaced rear brake pads and possibly bled. Installed new chain, cassette, and pads. General check over of entire bike.',
    performed_by: 'Scotty',
    parts: [
      { name: 'New Chain', brand: null },
      { name: 'New Cassette', brand: null },
      { name: 'Brake Pads', brand: null },
    ],
  },
  {
    bike: 'Orbea',
    date: null,
    service_type: 'Shifting + Rotor Service',
    description: 'Fixed shifting and aligned rear derailleur hanger. Aligned and trued rear rotor.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'Orbea',
    date: null,
    service_type: 'Fork Service',
    description: 'Serviced leaking left lower fork — replaced seals, parts, and fresh oil. General inspection of full bike. Two sets of pads included and used as needed.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'Orbea',
    date: null,
    service_type: 'Full Ebike Service + Build',
    description: 'Checked headset bearings. Removed old brakes (kept in bag with hoses reattached). Suspension bearing check and suspension check. Teardown and full cleaning. Installed: dropper post and lever, 12s chain, frame protection, Deore 51t cassette, new wheels, XT brakes. Software upgrade on all systems. Repaired clear coat chip on rim. Bedded in brakes. Full bolt check.',
    performed_by: 'Scotty',
    parts: [
      { name: '12s Chain', brand: null },
      { name: 'Deore 51t Cassette', brand: 'Shimano' },
      { name: 'XT Brakes', brand: 'Shimano' },
      { name: 'Dropper Post + Lever', brand: null },
    ],
  },
  {
    bike: 'Felt',
    date: null,
    service_type: 'Full Build + Drivetrain + Brake Service',
    description: 'Removed and cleaned chainring (required specialty tool). Installed 160 cranks with flat pedals. Installed chain and completed drivetrain work. Installed both chain stay covers (logo hidden). Installed front 203 rotor. Bled brakes and bedded in. Swapped dropper lever. Added bar ends. Replaced rear tire with tubeless-compatible used tire. Adjusted headset tightness. Full bolt check. Test ride. Software upgrade on display, motor, and battery systems.',
    performed_by: 'Scotty',
    parts: [
      { name: '160 Cranks', brand: null },
      { name: '203mm Front Rotor', brand: null },
    ],
  },
  {
    bike: 'Road Bike',
    date: null,
    service_type: 'Shifting + Bottom Bracket',
    description: 'Fixed shifting in lower gears. Investigated and addressed squeaking from pedal/bottom bracket area under high load.',
    performed_by: 'Scotty',
    parts: [],
  },
]

let success = 0
let failed = 0

for (const record of records) {
  const bikeId = bikeMap[record.bike]
  if (!bikeId) {
    console.log(`❌ Bike not found: "${record.bike}"`)
    failed++
    continue
  }

  const { error } = await supabase.from('service_records').insert({
    bike_id: bikeId,
    date: record.date,
    service_type: record.service_type,
    description: record.description,
    performed_by: record.performed_by,
    parts: record.parts,
  })

  if (error) {
    console.log(`❌ Failed: ${record.bike} — ${record.service_type}: ${error.message}`)
    failed++
  } else {
    console.log(`✅ Imported: ${record.bike} — ${record.service_type}`)
    success++
  }
}

console.log(`\n🏁 Done! ${success} imported, ${failed} failed.`)
