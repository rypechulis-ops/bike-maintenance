import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nwlyteyrvldqnimmhnvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHl0ZXlydmxkcW5pbW1obnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzMjMxNCwiZXhwIjoyMDkwOTA4MzE0fQ.JgIrIx9D3AK5cU8Wgxd34hdWhawYU3B8RXBIHEnVfDE'
)

const { data: bikes } = await supabase.from('bikes').select('id, name')
const bikeMap = {}
for (const bike of bikes) bikeMap[bike.name] = bike.id
console.log('Found bikes:', Object.keys(bikeMap).join(', '))

const records = [

  // ── BEAST ──────────────────────────────────────────────
  {
    bike: 'BEAST',
    date: '2023-05-26',
    service_type: 'Brake Service',
    description: 'Front and rear brake service. Used shop brake pads from stock. Service time: 1 hour.',
    performed_by: 'Matthew',
    parts: [],
  },
  {
    bike: 'BEAST',
    date: '2024-01-27',
    service_type: 'Brake Service',
    description: 'Rear brake service and new pad install (pad still had some life remaining but serviced proactively). Cut down rear brake standoff slightly. Bled and aligned rear brake. New pads and rotors supplied and installed as needed. Brake bedding completed. Service time: 3 hours 15 minutes.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Rear Brake Pads', brand: null },
      { name: 'Rear Rotor', brand: null },
    ],
  },
  {
    bike: 'BEAST',
    date: '2024-03-08',
    service_type: 'Brake Install',
    description: 'Installed XT 4-piston brake with supplied pads. Service time: 1 hour 15 minutes.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Shimano XT 4-Piston Brake', brand: 'Shimano' },
      { name: 'Brake Pads', brand: 'Shimano' },
    ],
  },
  {
    bike: 'BEAST',
    date: '2024-04-06',
    service_type: 'Suspension Service',
    description: 'Rear shock hardware swap including O-ring install on shock. Selected best fitting bushing from two options provided. Fork wiper service and full fork service. Removed batteries for access. General inspection — bike was running well.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Rear Shock Hardware + O-Ring', brand: null },
    ],
  },

  // ── SON OF BOB II ──────────────────────────────────────
  {
    bike: 'Son of Bob II',
    date: '2023-05-26',
    service_type: 'Wheel Service',
    description: 'Hub swap for rear wheel and installed rear wheel. Service time: 15 minutes.',
    performed_by: 'Matthew',
    parts: [],
  },
  {
    bike: 'Son of Bob II',
    date: '2023-10-14',
    service_type: 'Fork Install + Ebike Conversion',
    description: 'Fat tire ebike conversion — installed new suspension fork. Installed 180mm to 203mm rotor adapter for new fork (replacing previously installed 160mm to 203mm adapter). Service time: 30 minutes.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Suspension Fork', brand: null },
      { name: '180mm to 203mm Rotor Adapter', brand: null },
    ],
  },
  {
    bike: 'Son of Bob II',
    date: '2023-10-27',
    service_type: 'Brake Bed-in + Drivetrain + Safety Check',
    description: 'Inspected and bedded in brakes (Ryan had started but result was unsatisfactory — checked rear rotor and pads). Aligned drivetrain. General bolt and safety check. Test ride around the block to confirm everything set. Note: brake sensors NOT active on this bike, 4000 watts output — handle with care. Service time: 30 minutes.',
    performed_by: 'Matthew',
    parts: [],
  },
  {
    bike: 'Son of Bob II',
    date: '2024-03-08',
    service_type: 'Brake Install + Tune-up',
    description: 'Installed SLX 4-piston brake. Quick tune up and check over rest of bike. Tires pumped up before test ride (low tires cause handling issues at speed on this bike). Service time: 1 hour 15 minutes.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Shimano SLX 4-Piston Brake', brand: 'Shimano' },
    ],
  },

  // ── IZIP ───────────────────────────────────────────────
  {
    bike: 'IZIP',
    date: '2023-07-06',
    service_type: 'Wheel True + Brake Service',
    description: 'Minor true of front and rear wheels. Rear brake was squeaking — resurfaced rotors and pads, bedded in brakes. No squeak present after bedding. Service time: 1 hour.',
    performed_by: 'Matthew',
    parts: [],
  },
  {
    bike: 'IZIP',
    date: '2024-02-11',
    service_type: 'Brake Bleed',
    description: 'Rear brake bleed performed under Matthew warranty.',
    performed_by: 'Matthew',
    parts: [],
  },

  // ── SPIDER GWEN ────────────────────────────────────────
  {
    bike: 'Spider Gwen',
    date: '2023-06-07',
    service_type: 'Full Service + Dropper Install',
    description: 'Rear shock torque check (shock had been flipped and re-installed). Drivetrain tune — ran cable, cut chain to length, dialed in shifting. Brake alignment and bed in. Installed dropper seat post with remote lever. Ran all cables on left side of battery matching existing routing. Full bolt check and general inspection. Test ride.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Dropper Post + Remote Lever', brand: null },
    ],
  },
  {
    bike: 'Spider Gwen',
    date: '2023-08-12',
    service_type: 'Drivetrain Service',
    description: 'Swapped motor kit to standard configuration — required larger front chainring which necessitated new chain. Cut chain to length. Cable tension adjustment. No derailleur alignment needed. Test ride confirmed solid performance. Service time: 15 minutes.',
    performed_by: 'Matthew',
    parts: [
      { name: 'New Chain', brand: null },
    ],
  },
  {
    bike: 'Spider Gwen',
    date: '2024-02-11',
    service_type: 'General Service + Safety Check',
    description: 'Front wheel true (minor). Full bike check over and test ride. Minor shifting adjustment. Minor front brake alignment. Brakes do not need bleed — pads and rotors in good wear. Suspension hardware torque check — all points up to spec. Test ridden and good to go. Service time: 30 minutes.',
    performed_by: 'Matthew',
    parts: [],
  },

  // ── MARINE E RIFT ──────────────────────────────────────
  {
    bike: 'Marine E Rift',
    date: '2023-08-12',
    service_type: 'Fork Install + Brake Service + Drivetrain Service',
    description: 'Swapped rear brake and hose — did not need to use new hose. Bled burnt and old fluid from both front and rear brakes. Installed new Fox 36 fork (cut slightly longer to allow future adjustment). Note: front needs 203mm postmount adapter (default is 180mm) — rotor solution pending. Set up fork and shock sag and pressure baseline for ~165lb rider. Ran main cable through frame. Installed new chain and dialed in shifting — chain set on longer link side due to full suspension movement. Max recommended tire size: front 2.6in, rear 2.4in. Service time: ~4.5 hours across multiple sessions.',
    performed_by: 'Matthew',
    parts: [
      { name: 'Fox 36 Fork', brand: 'Fox' },
      { name: 'New Chain', brand: null },
    ],
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
    console.log(`✅ Imported: ${record.bike} — ${record.service_type} (${record.date})`)
    success++
  }
}

console.log(`\n🏁 Done! ${success} imported, ${failed} failed.`)
