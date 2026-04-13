import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Attractions from '../components/Attractions'
import DestinationCard from '../components/DestinationCard'
import FlightsList from '../components/FlightsList'
import HotelsList from '../components/HotelsList'
import ImageGallery from '../components/ImageGallery'
import ItineraryGenerator from '../components/ItineraryGenerator'
import Map from '../components/Map'
import WeatherWidget from '../components/WeatherWidget'
import { destinations, travelCategories } from '../utils/destinationsData'
import { useTravelData } from '../utils/TravelDataContext'
import { useI18n } from '../utils/I18nContext'

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedLocation, errors, setActiveMarkerId, setLocationAndLoad } = useTravelData()
  const { t } = useI18n()
  const category = searchParams.get('category') || 'All'
  const query = searchParams.get('q') || ''
  const deferredQuery = useDeferredValue(query)
  const isSearching = deferredQuery !== query

  const filteredDestinations = useMemo(() => {
    const searchValue = deferredQuery.trim().toLowerCase()
    return destinations
      .filter((destination) => {
        const categoryMatch = category === 'All' || destination.category === category
        if (!categoryMatch) return false
        if (!searchValue) return true
        return (
          destination.name.toLowerCase().includes(searchValue) ||
          destination.state.toLowerCase().includes(searchValue) ||
          destination.description.toLowerCase().includes(searchValue)
        )
      })
      .sort((a, b) => {
        const hiddenScoreA = a.uniqueness - a.popularity
        const hiddenScoreB = b.uniqueness - b.popularity
        return hiddenScoreB - hiddenScoreA
      })
  }, [category, deferredQuery])

  const autoLoadedCategoryRef = useRef('')

  useEffect(() => {
    if (category === 'All') {
      autoLoadedCategoryRef.current = ''
      return
    }
    if (!filteredDestinations.length) return
    const firstMatch = filteredDestinations[0]
    const autoLoadKey = `${category}:${firstMatch.id}`
    if (autoLoadedCategoryRef.current === autoLoadKey) return
    autoLoadedCategoryRef.current = autoLoadKey
    setLocationAndLoad(`${firstMatch.name}, ${firstMatch.state}`)
  }, [category, filteredDestinations, setLocationAndLoad])

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.exploreTitle')}</h1>
        <p className="muted-text mt-1 text-sm">
          Find hidden villages, rural escapes, and authentic local experiences across India.
        </p>
        {query && (
          <p className="mt-2 text-sm font-semibold text-primary dark:text-accent">
            Showing results for "{query}"
          </p>
        )}
        {selectedLocation && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </p>
        )}
      </header>

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied! 📋')
          }}
          className="btn-secondary text-sm"
        >
          🔗 Copy Link
        </button>
        <button
          onClick={() => {
            const text = `Explore hidden destinations on ThisIndia! 🇮🇳\n${window.location.href}`
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
          }}
          className="btn-secondary text-sm"
        >
           WhatsApp Share
        </button>
      </div>

      {errors.location && (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.location}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {['All', ...travelCategories].map((item) => (
          <button
            key={item}
            onClick={() =>
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                if (item === 'All') {
                  next.delete('category')
                } else {
                  next.set('category', item)
                }
                return next
              })
            }
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              category === item
                ? 'bg-sunset-gradient text-white'
                : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200'
            } border border-orange-100 shadow-sm transition-colors duration-300 dark:border-slate-700`}
          >
            {item}
          </button>
        ))}
      </div>

      <Map
        onMarkerSelect={(item) => {
          const target = document.getElementById(`attraction-${item.id}`)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }}
      />

      <Attractions onCardHover={(item) => setActiveMarkerId(item.id)} />
      <WeatherWidget />
      <HotelsList />
      <FlightsList />
      <ImageGallery />
      <ItineraryGenerator />

      {isSearching ? (
        <div className="card-surface p-5 text-sm text-slate-500 dark:text-slate-300">
          <span className="animate-pulse">Searching destinations...</span>
        </div>
      ) : filteredDestinations.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </section>
  )
}

export default Explore