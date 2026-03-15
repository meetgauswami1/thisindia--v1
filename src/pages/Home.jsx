import { motion as Motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard'
import HeroSection from '../components/HeroSection'
import ItineraryCard from '../components/ItineraryCard'
import ItineraryGenerator from '../components/ItineraryGenerator'
import LoadingSkeleton from '../components/LoadingSkeleton'
import TripPlannerForm from '../components/TripPlannerForm'
import TrendingDestinations from '../components/TrendingDestinations'
import WeatherWidget from '../components/WeatherWidget'
import { destinations, heroSlides, travelCategories } from '../utils/destinationsData'
import { useTravelData } from '../utils/TravelDataContext'
import { generateItinerary } from '../utils/travelUtils'

function Home() {
  const [tripResult, setTripResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { selectedLocation } = useTravelData()

  const handleGenerate = (formData) => {
    setLoading(true)
    setTimeout(() => {
      setTripResult(generateItinerary(formData))
      setLoading(false)
    }, 700)
  }

  return (
    <div className="space-y-10">
      <HeroSection slides={heroSlides} />
      <TrendingDestinations />

      {selectedLocation && (
        <section className="card-surface p-5">
          <h2 className="heading-text text-2xl">Selected Destination</h2>
          <p className="muted-text mt-1">{selectedLocation.label}</p>
        </section>
      )}

      <section className="space-y-4">
        <TripPlannerForm onGenerate={handleGenerate} />
        {loading && <LoadingSkeleton lines={4} />}
        {tripResult && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface space-y-4 p-5">
            <h3 className="heading-text text-xl">AI Itinerary Preview</h3>
            <div className="grid gap-3 md:grid-cols-4">
              {Object.entries(tripResult.summary).map(([key, value]) => (
                <div key={key} className="card-soft p-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{key}</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {tripResult.itinerary.slice(0, 2).map((day) => (
                <ItineraryCard key={day.day} day={day} />
              ))}
            </div>
          </Motion.div>
        )}
      </section>

      <WeatherWidget />
      <ItineraryGenerator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-text text-2xl">Trending Hidden Destinations</h2>
          <button onClick={() => navigate('/explore')} className="text-sm font-semibold text-primary dark:text-accent">
            View all
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {destinations.slice(0, 3).map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-text text-2xl">Travel Categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {travelCategories.map((category) => (
            <button
              key={category}
              onClick={() => navigate(`/explore?category=${encodeURIComponent(category)}`)}
              className="card-surface px-4 py-6 text-sm font-semibold text-slate-700 hover:-translate-y-1 hover:border-primary dark:text-slate-100"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-sunset-gradient p-6 text-white shadow-card">
        <h2 className="text-2xl font-bold">AI Assistant Preview</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-100">
          Ask for hidden places, instant itinerary drafts, weather-smart suggestions, and crowd-aware timing through our travel assistant.
        </p>
      </section>
    </div>
  )
}

export default Home
