'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bike, Part } from '@/lib/types'

const SERVICE_TYPES = [
  'Brake Service',
  'Tire/Tube Change',
  'Drivetrain Service',
  'Suspension Service',
  'Fork Service',
  'Shock Service',
  'Crash Damage Repair',
  'General Tune-up',
  'Wheel True/Build',
  'Cable/Housing',
  'Bearing Service',
  'Other',
]

function LogForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedBike = searchParams.get('bike') || ''

  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    bike_id: preselectedBike,
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    time_spent: '',
    service_type: '',
    custom_service_type: '',
    description: '',
    performed_by: '',
    parts: [] as Part[],
    total_cost: '',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/bikes')
      .then(res => res.json())
      .then((data: Bike[]) => setBikes((data || []).filter((b: Bike) => b.status === 'active')))
  }, [])

  const addPart = () => {
    setForm(f => ({ ...f, parts: [...f.parts, { name: '', brand: '', cost: undefined }] }))
  }

  const updatePart = (i: number, field: keyof Part, value: string) => {
    const parts = [...form.parts]
    parts[i] = {
      ...parts[i],
      [field]: field === 'cost' ? (value ? parseFloat(value) : undefined) : value,
    }
    setForm(f => ({ ...f, parts }))
  }

  const removePart = (i: number) => {
    setForm(f => ({ ...f, parts: f.parts.filter((_, idx) => idx !== i) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('bike_id', form.bike_id)
      formData.append('date', form.date)
      formData.append('mileage', form.mileage)
      formData.append('time_spent', form.time_spent)
      formData.append('service_type', form.service_type === 'Other' ? form.custom_service_type : form.service_type)
      formData.append('description', form.description)
      formData.append('performed_by', form.performed_by)
      formData.append('parts', JSON.stringify(form.parts.filter(p => p.name)))
      formData.append('total_cost', form.total_cost)
      formData.append('notes', form.notes)
      files.forEach(file => formData.append('files', file))

      const res = await fetch('/api/service-records', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Failed to save')

      router.push(`/bikes/${form.bike_id}`)
      router.refresh()
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600"

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-white mb-1">Log Service</h1>
        <p className="text-zinc-400 text-sm">Record maintenance work done to a bike</p>
      </div>

      {/* Bike */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Bike *</label>
        <select
          required
          value={form.bike_id}
          onChange={e => setForm(f => ({ ...f, bike_id: e.target.value }))}
          className={inputClass}
        >
          <option value="">Select a bike...</option>
          {bikes.map(bike => (
            <option key={bike.id} value={bike.id}>{bike.name}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Date *</label>
        <input
          type="date"
          required
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Mileage at Service</label>
        <input
          type="number"
          placeholder="e.g. 1250"
          value={form.mileage}
          onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* Time Spent */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Time Spent (hours)</label>
        <input
          type="number"
          step="0.25"
          placeholder="e.g. 1.5 for 1hr 30min"
          value={form.time_spent}
          onChange={e => setForm(f => ({ ...f, time_spent: e.target.value }))}
          className={inputClass}
        />
        {form.time_spent && (
          <p className="text-xs text-orange-400 mt-1">
            Labor cost: ${(parseFloat(form.time_spent) * 50).toFixed(2)}
          </p>
        )}
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Service Type *</label>
        <select
          required
          value={form.service_type}
          onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
          className={inputClass}
        >
          <option value="">Select type...</option>
          {SERVICE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {form.service_type === 'Other' && (
          <input
            type="text"
            required
            placeholder="Describe the service type..."
            value={form.custom_service_type}
            onChange={e => setForm(f => ({ ...f, custom_service_type: e.target.value }))}
            className={`${inputClass} mt-2`}
          />
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
        <textarea
          placeholder="What was done? Details of the work performed..."
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600 resize-none"
        />
      </div>

      {/* Performed By */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Performed By</label>
        <input
          type="text"
          placeholder="e.g. Self, Local Bike Shop, John's Cycles"
          value={form.performed_by}
          onChange={e => setForm(f => ({ ...f, performed_by: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* Parts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-300">Parts Used</label>
          <button type="button" onClick={addPart} className="text-sm text-orange-500 hover:text-orange-400">
            + Add Part
          </button>
        </div>
        {form.parts.map((part, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-2">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Part name *"
                value={part.name}
                onChange={e => updatePart(i, 'name', e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 placeholder-zinc-600"
              />
              <button
                type="button"
                onClick={() => removePart(i)}
                className="text-zinc-500 hover:text-red-400 text-xl px-1"
              >
                ×
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Brand"
                value={part.brand || ''}
                onChange={e => updatePart(i, 'brand', e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 placeholder-zinc-600"
              />
              <input
                type="number"
                placeholder="Cost $"
                value={part.cost || ''}
                onChange={e => updatePart(i, 'cost', e.target.value)}
                className="w-24 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 placeholder-zinc-600"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Cost */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Total Cost ($)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.total_cost}
          onChange={e => setForm(f => ({ ...f, total_cost: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Notes</label>
        <textarea
          placeholder="Any additional notes..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600 resize-none"
        />
      </div>

      {/* File Uploads */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Photos / Receipts</label>
        <label className="block w-full border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => setFiles(Array.from(e.target.files || []))}
          />
          <span className="text-3xl">📎</span>
          <p className="text-zinc-400 text-sm mt-2">Tap to add photos or PDFs</p>
          {files.length > 0 && (
            <p className="text-orange-400 text-sm mt-1">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
      >
        {loading ? 'Saving...' : 'Save Service Record'}
      </button>
    </form>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="p-4 text-zinc-400">Loading...</div>}>
      <LogForm />
    </Suspense>
  )
}
