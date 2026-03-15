import { destinations } from '../utils/destinationsData'

function MapExplorer({ activeFilter, onFilterChange }) {
  const filters = ['All', 'Nature', 'Heritage', 'Adventure', 'Spiritual']
  const visible =
    activeFilter === 'All'
      ? destinations
      : destinations.filter((destination) => destination.category === activeFilter)

  return (
    <section className="card-surface space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              activeFilter === filter
                ? 'bg-secondary text-white dark:bg-primary dark:text-white'
                : 'bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="relative h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-amber-100 to-rose-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
        {visible.map((destination, index) => (
          <button
            key={destination.id}
            className="absolute rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md transition-transform duration-300 hover:scale-105"
            style={{
              left: `${14 + (index % 4) * 22}%`,
              top: `${18 + (index % 3) * 24}%`,
            }}
          >
            {destination.name}
          </button>
        ))}
        <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 p-3 text-xs text-slate-700 shadow-card dark:bg-slate-900/80 dark:text-slate-200 dark:shadow-none">
          Interactive map area ready for API integration with marker popups and zoom controls.
        </div>
      </div>
    </section>
  )
}

export default MapExplorer
