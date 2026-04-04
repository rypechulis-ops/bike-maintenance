'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewBikePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', notes: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/bikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/')
      router.refresh()
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5">
      <div className="pt-6">
        <Link href="/" className="text-orange-500 text-sm mb-3 block">← Back to Fleet</Link>
        <h1 className="text-2xl font-bold text-white">Add New Bike</h1>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Bike Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. BEAST, Trail Ripper..."
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
        <input
          type="text"
          placeholder="e.g. Mountain, Road, E-Bike..."
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Notes</label>
        <textarea
          placeholder="Any details about this bike..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-zinc-600 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
      >
        {loading ? 'Adding...' : 'Add Bike'}
      </button>
    </form>
  )
}
