import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchLocationSuggestions } from '../services/geocodingService'

const defaultForm = {
  from: '',
  to: '',
  destination: '',
  duration: '3',
  budget: 'Medium',
  travelStyle: 'Culture',
  travelType: 'Solo',
}

function TripPlannerForm({ onGenerate, compact = false }) {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(() => {
    const prefilledTo = searchParams.get('to') || ''
    return { ...defaultForm, to: prefilledTo, destination: prefilledTo }
  })

  useEffect(() => {
    const handler = (event) => {
      const label = event?.detail?.label
      if (label) {
        setForm((prev) => ({ ...prev, to: label }))
      }
    }
    window.addEventListener('planner:setTo', handler)
    return () => window.removeEventListener('planner:setTo', handler)
  }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    if (form.from) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          const results = await fetchLocationSuggestions(`${lat},${lng}`)
          if (results && results[0]?.label) {
            setForm((prev) => ({ ...prev, from: results[0].label }))
          }
        } catch {
          return null
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 },
    )
  }, [form.from])

  const handleSubmit = (event) => {
    event.preventDefault()
    const destination = form.to || form.destination || ''
    onGenerate({ ...form, destination })
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4 p-5 md:p-6">
      <h3 className="heading-text text-xl">AI Trip Planner</h3>
      <div className={`grid gap-3 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">From</span>
          <input
            value={form.from}
            onChange={(event) => setForm((prev) => ({ ...prev, from: event.target.value }))}
            className="input-surface w-full"
            placeholder="Starting city"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">To</span>
          <input
            required
            value={form.to}
            onChange={(event) => setForm((prev) => ({ ...prev, to: event.target.value }))}
            className="input-surface w-full"
            placeholder="Destination"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Trip Duration</span>
          <select
            value={form.duration}
            onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
            className="input-surface w-full"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>
                {day} days
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Budget</span>
          <select
            value={form.budget}
            onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
            className="input-surface w-full"
          >
            {['Low', 'Medium', 'Luxury'].map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Travel Style</span>
          <select
            value={form.travelStyle}
            onChange={(event) => setForm((prev) => ({ ...prev, travelStyle: event.target.value }))}
            className="input-surface w-full"
          >
            {['Culture', 'Nature', 'Adventure', 'Food'].map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Travel Type</span>
          <select
            value={form.travelType}
            onChange={(event) => setForm((prev) => ({ ...prev, travelType: event.target.value }))}
            className="input-surface w-full"
          >
            {['Solo', 'Couple', 'Family', 'Friends'].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="btn-gradient text-sm">
        Generate AI Travel Plan
      </button>
    </form>
  )
}

export default TripPlannerForm
