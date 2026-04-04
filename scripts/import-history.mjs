import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nwlyteyrvldqnimmhnvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHl0ZXlydmxkcW5pbW1obnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMzMjMxNCwiZXhwIjoyMDkwOTA4MzE0fQ.JgIrIx9D3AK5cU8Wgxd34hdWhawYU3B8RXBIHEnVfDE'
)

const { data: bikes } = await supabase.from('bikes').select('id, name')
const bikeMap = {}
for (const bike of bikes) {
  bikeMap[bike.name] = bike.id
}
console.log('Found bikes:', Object.keys(bikeMap).join(', '))

const records = [

  // ── BEAST ──────────────────────────────────────────────
  {
    bike: 'BEAST',
    date: '2024-06-25',
    service_type: 'Brake Service + Safety Check',
    description: 'Inspected front brake pads (Shimano N04C) and rotor (Shimano RT88 203mm) — recommended replacement and full bleed. Front hose has worn outer casing due to rub. Rear rotor measured at 1.55mm, recommended replacement soon. Trued front wheel. Cleaned fork stanchions and rear shock body. Lubricated chain with Muc-Off Dry lube. Safety check: tightened loose rear rack hardware, tightened loose rear spoke, tightened pedals.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'BEAST',
    date: '2024-07-02',
    service_type: 'Brake Service',
    description: 'Cleaned front brake caliper and pistons. Installed replacement front brake pads (Shimano N04C) and rotor (Shimano RT88 203mm). Bled brake and purged air. Bedded in brake pads. Safety nut and bolt check.',
    performed_by: 'Scotty',
    parts: [
      { name: 'Shimano N04C Brake Pads', brand: 'Shimano' },
      { name: 'RT88 203mm Rotor', brand: 'Shimano' },
    ],
  },

  // ── SPIDER GWEN ────────────────────────────────────────
  {
    bike: 'Spider Gwen',
    date: null,
    service_type: 'Brake Install + General Setup',
    description: 'Installed Tektro Auriga rear brake and routed brake line. Trued rotors front and rear (rear was especially bad). Aligned rear derailleur hanger. Cut chain to length. Adjusted shifting — unlocked largest and smallest sprockets where shifting improved. Adjusted front chain guide. Bedded in brakes. Safety check.',
    performed_by: 'Scotty',
    parts: [
      { name: 'Tektro Auriga Rear Brake', brand: 'Tektro' },
    ],
  },
  {
    bike: 'Spider Gwen',
    date: '2024-06-07',
    service_type: 'Brake Bleed + General Service',
    description: 'Replaced brake oil and bled brakes front and rear. Cleaned and resurfaced brake pads. Centered calipers over rotors. Fixed rear brake rubbing under motor load — moved caliper slightly left. Trued rear rotor. Trued rear wheel (some radial hop remaining). Adjusted rear derailleur cable tension. Safety nut and bolt check. Added 4oz sealant per wheel. Lubricated chain. Note: dropper needs service (slow return). Bike creaks under heavy throttle.',
    performed_by: 'Scotty',
    parts: [],
  },

  // ── SON OF BOB II ──────────────────────────────────────
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
    bike: 'Son of Bob II',
    date: '2024-05-10',
    service_type: 'General Service + Brake Bleed + Tubeless Repair',
    description: 'Installed chain and lubricated with Muc-Off. Purged air from brake levers front and rear. Trued rotors front and rear. Flipped front tire direction and re-seated bead. Added 4oz sealant to front and rear wheels. Aligned rear derailleur hanger. Adjusted shifting cable tension. Safety nut and bolt check. Test ride. Follow-up visits: tightened headset. Overhauled rear brake caliper and performed full bleed. Repaired front tubeless (removed old tape, double layered new tape, added sealant, aired to 20psi). Installed new chain. Test ride confirmed no brake dragging. Chain wear measured at 0.64.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'Son of Bob II',
    date: '2024-06-05',
    service_type: 'New Build Setup',
    description: 'Centered brake calipers and trued rotors front and rear. Aligned rear derailleur hanger. Installed supplied rear derailleur, chain, and housing. Adjusted shifting. Safety nut and bolt check with torque specs applied. Test ride confirmed everything rode and functioned smoothly. Note: chain connecting link may be fitting slightly loose, may recommend replacing.',
    performed_by: 'Scotty',
    parts: [],
  },

  // ── ORBEA ──────────────────────────────────────────────
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

  // ── FELT ───────────────────────────────────────────────
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

  // ── ROAD BIKE ──────────────────────────────────────────
  {
    bike: 'Road Bike',
    date: null,
    service_type: 'Shifting + Bottom Bracket',
    description: 'Fixed shifting in lower gears. Investigated and addressed squeaking from pedal/bottom bracket area under high load.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'Road Bike',
    date: '2024-09-03',
    service_type: 'General Tune-up + Drivetrain Clean',
    description: 'Full TLC service. Checked all parts and replaced as needed using shop stock. Removed drivetrain and cleaned in parts washer. Fixed two busted spokes on rear wheel. Wiped down bike. Full inspection and safety check.',
    performed_by: 'Scotty',
    parts: [],
  },

  // ── MARINE E RIFT ──────────────────────────────────────
  {
    bike: 'Marine E Rift',
    date: '2024-05-08',
    service_type: 'General Service + Suspension Setup + Brake Bleed',
    description: 'Added tension to rear wheel spokes. Trued front wheel. Lever bleed for rear brake. Replaced burnt oil for front brake, bled, and centered caliper. Rear brake oil may need replacing later but feels firm. Aligned rear derailleur hanger and adjusted cable tension. Added 3oz sealant to front and rear wheels. Set air pressure front and rear to 32 psi. Installed replacement core to rear valve. Set rear shock to 175 psi and front fork to 80 psi. Safety nut and bolt check. Test ride confirmed good shifting.',
    performed_by: 'Scotty',
    parts: [],
  },
  {
    bike: 'Marine E Rift',
    date: '2024-08-26',
    service_type: 'Wheel True + Brake Bleed + General Service',
    description: 'Trued front and rear wheels (note: some spokes and nipples are incorrect length with nipples bottoming out — new wheelset recommended in future). Trued front and rear rotors. Aligned rear derailleur hanger and adjusted shifting slightly. Bled rear brake and replaced contaminated oil. Note: front rotor measured at 1.45mm and needs replacing — recommend full front brake bleed when rotor is replaced. Swapped saddle. Service time: 1 hour 30 mins.',
    performed_by: 'Scotty',
    parts: [],
  },

  // ── IZIP ───────────────────────────────────────────────
  {
    bike: 'IZIP',
    date: '2024-04-22',
    service_type: 'Brake Service + Drivetrain + Safety Check',
    description: 'Resurfaced brake pads and rear rotor. Replaced rear brake pads due to contamination. Resurfaced rotor and bedded in new pads. Rear brake now stops with no noise and full power. Quick bike wipe down. Degreased chain, cassette, and pulley wheels. Aligned rear derailleur hanger slightly. Adjusted rear derailleur cable tension. Safety nut and bolt check: tightened loose stem bolts, crank compression bolt, and rack hardware.',
    performed_by: 'Scotty',
    parts: [],
  },
]

// Import all records
let success = 0
let failed = 0

for (const record of records) {
  const bikeId = bikeMap[record.bike]
  if (!bikeId) {
    console.log(`❌ Bike not found in database: "${record.bike}"`)
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
    console.log(`✅ Imported: ${record.bike} — ${record.service_type} ${record.date ? `(${record.date})` : '(no date)'}`)
    success++
  }
}

console.log(`\n🏁 Done! ${success} records imported, ${failed} failed.`)
