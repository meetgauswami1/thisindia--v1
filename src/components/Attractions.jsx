import { useMemo, useState } from 'react'
import { useTravelData } from '../utils/TravelDataContext'

function Attractions({ onCardHover }) {
  const { travelData, activeMarkerId, setActiveMarkerId, loadingState, errors } = useTravelData()
  const [sortBy, setSortBy] = useState('rating')
  const [visibleCount, setVisibleCount] = useState(6)

  const sortedAttractions = useMemo(() => {
    const list = [...(travelData.attractions || [])]
    console.log("Attractions from context:", travelData.attractions);
    if (sortBy === 'popularity') {
      return list.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0))
    }
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }, [travelData.attractions, sortBy])

  const visible = sortedAttractions.slice(0, visibleCount)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading-text text-2xl">Tourist Attractions</h2>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="input-surface w-40"
        >
          <option value="rating">Sort by Rating</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      {loadingState.fetchingData ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">Loading attractions...</div>
      ) : errors.attractions ? (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.attractions}</div>
      ) : !visible.length ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">No attractions found for this destination.</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((item) => (
              <article
                key={item.id}
                id={`attraction-${item.id}`}
                onMouseEnter={() => {
                  setActiveMarkerId(item.id)
                  if (onCardHover) onCardHover(item)
                }}
                onMouseLeave={() => setActiveMarkerId(null)}
                className={`card-surface p-4 transition-all duration-300 ${
                  activeMarkerId === item.id ? 'ring-2 ring-orange-300 dark:ring-accent/60' : ''
                }`}
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
                )}
                <h3 className="mt-3 text-lg font-bold text-secondary dark:text-orange-300">{item.name}</h3>
                <p className="muted-text mt-1 text-sm">{item.description}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="chip-surface">⭐ {item.rating || 'N/A'}</span>
                  <span className="chip-surface">👥 {item.totalRatings || 0}</span>
                </div>
              </article>
            ))}
          </div>
          {visibleCount < sortedAttractions.length && (
            <button onClick={() => setVisibleCount((prev) => prev + 6)} className="btn-gradient text-sm">
              Load More
            </button>
          )}
        </>
      )}
    </section>
  )
}

export default Attractions
