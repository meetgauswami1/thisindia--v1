import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTravel } from '../utils/TravelContext'
import { useI18n } from '../utils/I18nContext'
import { downloadTripGuidePdf, generateItinerary } from '../utils/travelUtils'
import ItineraryCard from '../components/ItineraryCard'
import TripPlannerForm from '../components/TripPlannerForm'

function TripPlanner() {
  const [result, setResult] = useState(null)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const { addSavedTrip } = useTravel()
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!showSavedToast) return undefined
    const timer = setTimeout(() => setShowSavedToast(false), 5000)
    return () => clearTimeout(timer)
  }, [showSavedToast])

  const handleGenerate = (formData) => {
    setResult(generateItinerary(formData))
  }

  const handleSave = () => {
    if (result) {
      addSavedTrip(result)
      setShowSavedToast(true)
    }
  }

  return (
    <section className="space-y-6">
      {showSavedToast && (
        <div className="fixed right-4 top-24 z-[80] w-full max-w-sm rounded-2xl border border-orange-200 bg-white p-4 shadow-card dark:border-slate-600 dark:bg-darkcard">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Your trip has been saved! 🎉</p>
          <button
            onClick={() => {
              setShowSavedToast(false)
              navigate('/saved-trips')
            }}
            className="mt-3 btn-gradient text-xs"
          >
            Go to Saved Trips
          </button>
        </div>
      )}
      <header>
        <h1 className="heading-text text-3xl">{t('pages.tripPlannerTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Generate a smart AI-style itinerary for 1–7 days.</p>
      </header>

      <TripPlannerForm key={location.search || 'trip-planner-default'} onGenerate={handleGenerate} compact />

      {result && (
        <div className="card-surface space-y-4 p-5">
          <h2 className="heading-text text-2xl">AI Travel Planner Results</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(result.summary).map(([key, value]) => (
              <div key={key} className="card-soft p-3 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{key}</p>
                <p className="font-semibold text-slate-700 dark:text-slate-100">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {result.itinerary.map((day) => (
              <ItineraryCard key={day.day} day={day} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <button className="btn-secondary text-sm">View on Map</button> */}
            <button onClick={handleSave} className="btn-gradient text-sm">
              Save This Trip
            </button>
            <button
              onClick={() => downloadTripGuidePdf(result)}
              className="btn-gradient text-sm"
            >
              Download Travel Guide PDF
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default TripPlanner
