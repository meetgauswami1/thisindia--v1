import { motion as Motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'

function HeroSection({ slides }) {
  const [index, setIndex] = useState(0)
  const fallbackImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=80'

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [slides.length])

  const current = slides[index]

  return (
    <section className="relative overflow-visible rounded-3xl shadow-card">
      <img
        src={current.image}
        alt={current.title}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = fallbackImage
        }}
        className="h-[420px] w-full object-cover transition-transform duration-700 md:h-[560px]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/35 to-orange-500/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.2),transparent_55%)]" />
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-white md:p-12"
      >
        <p className="mb-3 inline-block w-fit rounded-full border border-white/35 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur md:text-sm">
          {current.state}
        </p>
        <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-6xl">
          Plan Smarter Journeys with AI Travel Insights
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/90 md:text-lg">
          Choose your starting city, pick any destination, and instantly unlock maps, weather, flights, stays, and personalized plans.
        </p>
        <SearchBar className="mt-6 w-full max-w-4xl" placeholder="Search destinations in India" />
      </Motion.div>
    </section>
  )
}

export default HeroSection
