import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDestinationImages } from '../services/imageService'
import { useTravelData } from '../utils/TravelDataContext'

const trendingCities = ['Paris', 'Dubai', 'Bali', 'Goa', 'Tokyo', 'London', 'Singapore']

function TrendingDestinations() {
  const navigate = useNavigate()
  const { setLocationAndLoad } = useTravelData()
  const [imagesByCity, setImagesByCity] = useState({})
  const fallbackImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80'

  useEffect(() => {
    const run = async () => {
      const entries = await Promise.all(
        trendingCities.map(async (city) => {
          const images = await fetchDestinationImages(city, 1).catch(() => [])
          return [city, images[0]?.thumb || null]
        }),
      )
      setImagesByCity(Object.fromEntries(entries))
    }
    run()
  }, [])

  const handleCityClick = async (city) => {
    await setLocationAndLoad(city)
    navigate(`/explore?q=${encodeURIComponent(city)}`)
  }

  return (
    <section className="space-y-4">
      <h2 className="heading-text text-2xl">Trending Destinations</h2>
      <div className="grid gap-3 overflow-x-auto pb-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {trendingCities.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className="card-surface group overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
          >
            <img
              src={imagesByCity[city] || fallbackImage}
              alt={city}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = fallbackImage
              }}
              className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="p-3">
              <p className="text-base font-semibold text-secondary dark:text-orange-300">{city}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default TrendingDestinations
