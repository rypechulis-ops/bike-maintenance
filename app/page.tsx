import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

async function getBikesWithLastService() {
  const { data: bikes } = await supabaseAdmin
    .from('bikes')
    .select('*')
    .order('name')

  const { data: records } = await supabaseAdmin
    .from('service_records')
    .select('bike_id, date, service_type, mileage')
    .order('date', { ascending: false })

  return (bikes || []).map(bike => {
    const lastRecord = (records || []).find(r => r.bike_id === bike.id)
    return { ...bike, lastRecord }
  })
}

export default async function HomePage() {
  const bikes = await getBikesWithLastService()
  const activeBikes = bikes.filter(b => b.status === 'active')
  const retiredBikes = bikes.filter(b => b.status === 'retired')

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 pt-6">
        <h1 className="text-2xl font-bold text-white">🚲 My Fleet</h1>
        <Link
          href="/bikes/new"
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add Bike
        </Link>
      </div>

      <div className="space-y-3">
        {activeBikes.map(bike => (
          <Link key={bike.id} href={`/bikes/${bike.id}`}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-orange-500 transition-colors mb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{bike.name}</h2>
                <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">Active</span>
              </div>
              {bike.lastRecord ? (
                <p className="text-sm text-zinc-400 mt-1">
                  Last service:{' '}
                  <span className="text-zinc-300">
                    {bike.lastRecord.date ? new Date(bike.lastRecord.date).toLocaleDateString() : 'Date unknown'}
                  </span>
                  {' · '}
                  <span className="text-zinc-300">{bike.lastRecord.service_type}</span>
                </p>
              ) : (
                <p className="text-sm text-zinc-500 mt-1">No service records yet</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {activeBikes.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">🚲</p>
          <p>No bikes yet.</p>
          <p className="text-sm mt-1">Tap &quot;+ Add Bike&quot; to get started!</p>
        </div>
      )}

      {retiredBikes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">Retired</h2>
          <div className="space-y-3">
            {retiredBikes.map(bike => (
              <Link key={bike.id} href={`/bikes/${bike.id}`}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 opacity-60 hover:opacity-80 transition-opacity mb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{bike.name}</h2>
                    <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Retired</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
