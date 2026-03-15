import { useMemo, useState } from 'react'
import { useTravelData } from '../utils/TravelDataContext'

function HotelsList() {
  const { travelData, selectedLocation, loadingState, errors } = useTravelData()
  const [minRating, setMinRating] = useState(0)
  const [activeType, setActiveType] = useState('hotels')

  const distanceBetween = (lat1, lng1, lat2, lng2) => {
    const rad = (value) => (value * Math.PI) / 180
    const earth = 6371
    const dLat = rad(lat2 - lat1)
    const dLng = rad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const filtered = useMemo(
    () =>
      (travelData[activeType] || [])
        .map((item) => ({
          ...item,
          distance: selectedLocation
            ? distanceBetween(selectedLocation.lat, selectedLocation.lng, item.location.lat, item.location.lng)
            : null,
        }))
        .filter((item) => (item.rating || 0) >= minRating),
    [travelData, activeType, selectedLocation, minRating],
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="heading-text text-2xl">Hotels and Restaurants</h2>
        <div className="flex gap-2">
          {['hotels', 'restaurants', 'cafes'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                activeType === type
                  ? 'bg-sunset-gradient text-white'
                  : 'bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="card-surface flex flex-wrap gap-3 p-3 text-sm">
        <label className="flex items-center gap-2">
          <span>Rating</span>
          <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(event) => setMinRating(Number(event.target.value))} />
          <span>{minRating}+</span>
        </label>
      </div>

      {loadingState.fetchingData ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">Loading nearby places...</div>
      ) : errors.hotels ? (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.hotels}</div>
      ) : !filtered.length ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">No nearby places found.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.slice(0, 12).map((item) => (
            <article key={item.id} className="card-surface p-4">
              <h3 className="font-semibold text-secondary dark:text-orange-300">{item.name}</h3>
              <p className="muted-text mt-1 text-sm">{item.address}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="chip-surface">⭐ {item.rating || 'N/A'}</span>
                <span className="chip-surface">{item.distance ? `${item.distance.toFixed(1)} km` : 'Distance N/A'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default HotelsList
