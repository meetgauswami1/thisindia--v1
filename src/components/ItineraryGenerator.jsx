import { useState } from 'react'
import { generateAIItinerary } from '../services/aiItineraryService'
import { useTravelData } from '../utils/TravelDataContext'

function ItineraryGenerator() {
  const { selectedLocation } = useTravelData()
  const [openPlanner, setOpenPlanner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itinerary, setItinerary] = useState(null)
  const [form, setForm] = useState({
    destination: '',
    days: 3,
    interests: ['culture'],
    budget: 'medium',
  })

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleGenerate = async () => {
    const destination = form.destination || selectedLocation?.label
    if (!destination) {
      setError('Select a destination before generating itinerary.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await generateAIItinerary({
        destination,
        days: form.days,
        interests: form.interests,
        budget: form.budget,
      })
      setItinerary(result)
      setOpenPlanner(false)
    } catch {
      setError('Failed to generate itinerary. Please check API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="space-y-4">
        <h2 className="heading-text text-2xl">AI Travel Itinerary Generator</h2>
        {error && <div className="card-surface p-4 text-sm text-rose-500">{error}</div>}
        {itinerary && (
          <div className="card-surface space-y-3 p-5">
            <h3 className="heading-text text-lg">{itinerary.summary || 'Generated Itinerary'}</h3>
            {(itinerary.days || []).map((day) => (
              <article key={day.day} className="card-soft p-3">
                <h4 className="font-semibold text-secondary dark:text-orange-300">
                  Day {day.day}: {day.title}
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {(day.activities || []).map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      

      {openPlanner && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="card-surface w-full max-w-xl space-y-4 p-5">
            <h3 className="heading-text text-xl">Plan My Trip</h3>
            <input
              value={form.destination}
              onChange={(event) => setForm((prev) => ({ ...prev, destination: event.target.value }))}
              className="input-surface w-full"
              placeholder={selectedLocation?.label || 'Destination'}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block">Number of days</span>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={form.days}
                  onChange={(event) => setForm((prev) => ({ ...prev, days: Number(event.target.value) }))}
                  className="input-surface w-full"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block">Travel style</span>
                <select
                  value={form.budget}
                  onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                  className="input-surface w-full"
                >
                  <option value="budget">Budget</option>
                  <option value="luxury">Luxury</option>
                  <option value="adventure">Adventure</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {['nature', 'culture', 'adventure', 'food'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    form.interests.includes(interest)
                      ? 'bg-sunset-gradient text-white'
                      : 'bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenPlanner(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button onClick={handleGenerate} disabled={loading} className="btn-gradient text-sm">
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ItineraryGenerator
