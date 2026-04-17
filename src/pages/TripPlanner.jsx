import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import toast from 'react-hot-toast'
=======
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
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
<<<<<<< HEAD
=======

  useEffect(() => {
    if (!showSavedToast) return undefined
    const timer = setTimeout(() => setShowSavedToast(false), 5000)
    return () => clearTimeout(timer)
  }, [showSavedToast])
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d

  const handleGenerate = (formData) => {
    setResult(generateItinerary(formData))
    toast.success('Itinerary generated! 🗺️')
  }

  const handleSave = () => {
    if (result) {
      addSavedTrip(result)
<<<<<<< HEAD
      toast.success(
        (toastInstance) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Trip saved successfully! 🎉</p>
            <button
              onClick={() => {
                toast.dismiss(toastInstance.id)
                navigate('/saved-trips')
              }}
              className="text-xs underline text-orange-300"
            >
              View Saved Trips →
            </button>
          </div>
        ),
        { duration: 5000 }
      )
=======
      setShowSavedToast(true)
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
    }
  }

  const handleDownload = () => {
    downloadTripGuidePdf(result)
    toast.success('PDF downloaded! 📄')
  }

  const handleWhatsApp = () => {
    const destination = result?.summary?.Destination || 'an amazing destination'
    const text = `I just planned a trip to ${destination} using ThisIndia! 🇮🇳✨\nPlan yours at: ${window.location.origin}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied! 📋')
  }
  const handlePrint = () => {
  window.print()
  toast.success('Printing... 🖨️')
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
        <p className="muted-text mt-1 text-sm">
          Generate a smart AI-style itinerary for 1–7 days.
        </p>
      </header>

      <TripPlannerForm
        key={location.search || 'trip-planner-default'}
        onGenerate={handleGenerate}
        compact
      />

      {result && (
        <div className="card-surface space-y-4 p-5">
          <h2 className="heading-text text-2xl">AI Travel Planner Results</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(result.summary).map(([key, value]) => (
              <div key={key} className="card-soft p-3 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {key}
                </p>
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
<<<<<<< HEAD
=======
            {/* <button className="btn-secondary text-sm">View on Map</button> */}
>>>>>>> 084d6d2a21a9340457da8a2780c353eb1957cc9d
            <button onClick={handleSave} className="btn-gradient text-sm">
              Save This Trip
            </button>
            <button onClick={handleDownload} className="btn-gradient text-sm">
              Download Travel Guide PDF
            </button>
            <button onClick={handleWhatsApp} className="btn-secondary text-sm">
              📱 WhatsApp Share
            </button>
            <button onClick={handleCopyLink} className="btn-secondary text-sm">
              🔗 Copy Link
            </button>
            <button onClick={handlePrint} className="btn-secondary text-sm">
  🖨️ Print Itinerary
</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default TripPlanner