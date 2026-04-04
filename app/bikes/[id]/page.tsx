import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Part, ServiceFile } from '@/lib/types'

export const revalidate = 0

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

async function getBike(id: string) {
  const { data } = await supabaseAdmin
    .from('bikes')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getServiceRecords(bikeId: string) {
  const { data } = await supabaseAdmin
    .from('service_records')
    .select('*, service_files(*)')
    .eq('bike_id', bikeId)
    .order('date', { ascending: false })
  return data || []
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bike = await getBike(id)
  if (!bike) notFound()

  const records = await getServiceRecords(id)

  return (
    <div className="p-4">
      <div className="pt-6 mb-6">
        <Link href="/" className="text-orange-500 text-sm mb-3 block">← Back to Fleet</Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{bike.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            bike.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {bike.status === 'active' ? 'Active' : 'Retired'}
          </span>
        </div>
        <p className="text-zinc-400 text-sm mt-1">
          {records.length} service record{records.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Link
        href={`/log?bike=${bike.id}`}
        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium mb-6 transition-colors"
      >
        + Log Service for {bike.name}
      </Link>

      {records.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-4xl mb-3">🔧</p>
          <p>No service records yet.</p>
          <p className="text-sm mt-1">Log the first service above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-orange-400 font-semibold">{record.service_type}</span>
                  <p className="text-sm text-zinc-400">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                {record.mileage && (
                  <span className="text-sm text-zinc-400">{record.mileage.toLocaleString()} mi</span>
                )}
              </div>

              {record.description && (
                <p className="text-zinc-300 text-sm mb-2">{record.description}</p>
              )}

              {record.performed_by && (
                <p className="text-xs text-zinc-500">
                  By: <span className="text-zinc-400">{record.performed_by}</span>
                </p>
              )}

              {record.parts && record.parts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Parts used:</p>
                  {(record.parts as Part[]).map((part, i) => (
                    <div key={i} className="flex justify-between text-xs text-zinc-400">
                      <span>{part.name}{part.brand ? ` (${part.brand})` : ''}</span>
                      {part.cost && <span>${part.cost}</span>}
                    </div>
                  ))}
                </div>
              )}

              {record.total_cost && (
                <p className="text-sm font-medium text-zinc-300 mt-2">Total: ${record.total_cost}</p>
              )}

              {record.notes && (
                <p className="text-xs text-zinc-500 mt-2 italic">{record.notes}</p>
              )}

              {record.service_files && record.service_files.length > 0 && (
                <div className="mt-3 pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {(record.service_files as ServiceFile[]).map((file) => {
                      const isImage = file.file_type?.startsWith('image/')
                      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/service-files/${file.file_path}`
                      return (
                        <a key={file.id} href={fileUrl} target="_blank" rel="noopener noreferrer">
                          {isImage ? (
                            <img
                              src={fileUrl}
                              alt={file.file_name}
                              className="h-16 w-16 object-cover rounded-lg border border-zinc-700"
                            />
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-orange-400 bg-zinc-800 px-2 py-1 rounded">
                              📄 {file.file_name}
                            </div>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
