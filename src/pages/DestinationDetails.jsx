import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CrowdPredictorCard from '../components/CrowdPredictorCard'
import HiddenGemBadge from '../components/HiddenGemBadge'
import WeatherCard from '../components/WeatherCard'
import { destinations } from '../utils/destinationsData'
import { useTravel } from '../utils/TravelContext'
import { getCrowdPrediction, getHiddenGemScore } from '../utils/travelUtils'

function DestinationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { saveDestination } = useTravel()
  const destination = destinations.find((item) => item.id === id)
  const fallbackImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80'

  const crowd = useMemo(() => {
    if (!destination) return null
    return getCrowdPrediction({
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      weather: destination.weather,
      popularity: destination.popularity,
    })
  }, [destination])

  if (!destination || !crowd) {
    return <div className="card-surface p-8 text-center">Destination not found.</div>
  }

  const score = getHiddenGemScore(destination.popularity, destination.uniqueness)

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl shadow-card">
        <img
          src={destination.heroImage}
          alt={destination.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackImage
          }}
          className="h-[340px] w-full object-cover md:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-orange-500/20 to-transparent" />
        <div className="absolute bottom-5 left-5 text-white">
          <p className="text-sm">{destination.state}</p>
          <h1 className="text-3xl font-bold md:text-4xl">{destination.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">{destination.description}</p>
        </div>
      </div>

      <div className="card-surface space-y-4 p-5">
        <HiddenGemBadge score={score} />
        <div className="grid gap-4 md:grid-cols-2">
          <WeatherCard weather={destination.weather} />
          <CrowdPredictorCard crowd={crowd} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-surface p-4">
            <h3 className="mb-2 font-bold text-secondary dark:text-orange-300">Nearby Attractions</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {destination.nearbyAttractions.map((item) => (
                <li key={item} className="card-soft px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-4">
            <h3 className="mb-2 font-bold text-secondary dark:text-orange-300">Local Food Suggestions</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {destination.localFood.map((item) => (
                <li key={item} className="card-soft px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-bold text-secondary dark:text-orange-300">Image Gallery</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {[destination.image, destination.heroImage, destination.image].map((image, index) => (
              <img
                key={`${destination.id}-${index}`}
                src={image}
                alt={destination.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = fallbackImage
                }}
                className="h-40 w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary text-sm">View on Map</button>
          <button
            onClick={() => {
              const label = `${destination.name}, ${destination.state}`
              window.dispatchEvent(new CustomEvent('planner:setTo', { detail: { label } }))
              navigate(`/trip-planner?to=${encodeURIComponent(label)}`)
            }}
            className="btn-gradient text-sm"
          >
            Add to Destination
          </button>
          <button
            onClick={() => saveDestination(destination)}
            className="btn-gradient text-sm"
          >
            Save Destination
          </button>
        </div>
      </div>
    </section>
  )
}

export default DestinationDetails
