import { motion as Motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { getHiddenGemScore } from '../utils/travelUtils'
import HiddenGemBadge from './HiddenGemBadge'

function DestinationCard({ destination, onSelect }) {
  const score = getHiddenGemScore(destination.popularity, destination.uniqueness)
  const navigate = useNavigate()
  const fallbackImage = `https://source.unsplash.com/1200x800/?${encodeURIComponent(`${destination.name}, ${destination.state}, india travel`)}`.replaceAll('%20', '+')

  return (
    <Motion.article
      whileHover={{ y: -6 }}
      onClick={() => {
        if (onSelect) {
          onSelect(destination)
        }
      }}
      className={`card-surface group overflow-hidden ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <div className="overflow-hidden">
        <img
          src={destination.heroImage || destination.image}
          alt={destination.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackImage
          }}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary dark:text-orange-300">{destination.name}</h3>
          <span className="chip-surface">
            {destination.state}
          </span>
        </div>
        <p className="muted-text text-sm">{destination.description}</p>
        <HiddenGemBadge score={score} />
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/destination/${destination.id}`}
            onClick={(event) => event.stopPropagation()}
            className="btn-gradient inline-flex text-sm"
          >
            Explore
          </Link>
          <button
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/trip-planner?to=${encodeURIComponent(`${destination.name}, ${destination.state}`)}`)
            }}
            className="btn-secondary inline-flex text-sm"
          >
            Add Destination
          </button>
        </div>
      </div>
    </Motion.article>
  )
}

export default DestinationCard
