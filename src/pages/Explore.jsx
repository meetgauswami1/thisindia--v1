import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
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

  // ✅ Video states
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)

  const category = searchParams.get('category') || 'All'
  const query = searchParams.get('q') || ''
  const deferredQuery = useDeferredValue(query)
  const isSearching = deferredQuery !== query

  // 🔥 NEW: handle query → load location (MAIN FIX)
  const lastQueryRef = useRef('')

  useEffect(() => {
    if (!query) return

    const formattedQuery = `${query}, India`

    // avoid duplicate calls
    if (lastQueryRef.current === formattedQuery) return
    lastQueryRef.current = formattedQuery

    const timer = setTimeout(() => {
      setLocationAndLoad(formattedQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [query, setLocationAndLoad])

  // ✅ Fetch YouTube Videos
  const fetchVideos = async (searchQuery) => {
    if (!searchQuery) {
      setVideos([])
      return
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery} travel vlog India&type=video&maxResults=6&key=AIzaSyB8vPCEaPWc6fw61uIF3Usr-tCoAHrLdEM`
      )
      const data = await res.json()
      setVideos(data.items || [])
    } catch (err) {
      console.error('Video fetch error:', err)
    }
  }

  useEffect(() => {
    fetchVideos(query)
  }, [query])

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

      {/* Image Gallery */}
      <ImageGallery />

      {/* 🎥 YouTube Video Section */}
      {videos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            🎥 Travel Videos
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => {
              const videoId = video.id.videoId
              const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

              return (
                <div
                  key={videoId}
                  onClick={() => setSelectedVideo(videoId)}
                  className="relative cursor-pointer rounded-xl overflow-hidden group"
                >
                  <img
                    src={thumbnail}
                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full text-black text-lg">
                      ▶
                    </div>
                  </div>

                  <p className="absolute bottom-0 text-white text-sm p-2 line-clamp-2">
                    {video.snippet.title}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 🎬 Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>

            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full rounded-xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

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