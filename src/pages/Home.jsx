import { motion as Motion } from 'framer-motion'
<<<<<<< HEAD
import { useMemo, useState, useEffect, useRef } from 'react'
=======
import { useMemo, useState } from 'react'
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
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
import { useI18n } from '../utils/I18nContext'
import { generateItinerary } from '../utils/travelUtils'

// Animated Counter Component
function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

function Home() {
  const [tripResult, setTripResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { selectedLocation, setLocationAndLoad } = useTravelData()
  const { t } = useI18n()
<<<<<<< HEAD

=======
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
  const hiddenGems = useMemo(
    () =>
      [...destinations]
        .filter((item) => item.popularity <= 40 || item.uniqueness >= 88)
        .sort((a, b) => a.popularity - b.popularity || b.uniqueness - a.uniqueness)
        .slice(0, 3),
    [],
  )

  const handleGenerate = (formData) => {
    setLoading(true)
    setTimeout(() => {
      setTripResult(generateItinerary(formData))
      setLoading(false)
    }, 700)
  }

  const handleDestinationSelect = async (destination) => {
    await setLocationAndLoad(`${destination.name}, ${destination.state}`)
    navigate(`/explore?q=${encodeURIComponent(destination.name)}`)
  }

  return (
    <div className="space-y-10">
      <HeroSection slides={heroSlides} />
<<<<<<< HEAD

      {/* Animated Stats Section */}
      <section className="rounded-2xl bg-sunset-gradient p-6 text-white shadow-card">
        <h2 className="text-center text-2xl font-bold mb-6">
          ThisIndia By The Numbers
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-4xl font-bold">
              <AnimatedCounter target={500} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-white/80">Hidden Destinations</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <AnimatedCounter target={28} suffix="" />
            </p>
            <p className="mt-1 text-sm text-white/80">States Covered</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <AnimatedCounter target={10000} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-white/80">Trips Planned</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <AnimatedCounter target={95} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-white/80">Rural Communities Helped</p>
          </div>
        </div>
      </section>

=======
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-text text-2xl">{t('common.hiddenGemsTitle')}</h2>
          <button onClick={() => navigate('/explore')} className="text-sm font-semibold text-primary dark:text-accent">
            Explore rural picks
          </button>
        </div>
        <p className="muted-text text-sm">Discover lesser-known villages, local trails, and authentic rural tourism experiences.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {hiddenGems.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} onSelect={handleDestinationSelect} />
          ))}
        </div>
      </section>
<<<<<<< HEAD

=======
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
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
          <h2 className="heading-text text-2xl">{t('common.trendingTitle')}</h2>
          <button onClick={() => navigate('/explore')} className="text-sm font-semibold text-primary dark:text-accent">
            View all
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {destinations.slice(0, 3).map((destination) => (
            <DestinationCard key={destination.id} destination={destination} onSelect={handleDestinationSelect} />
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