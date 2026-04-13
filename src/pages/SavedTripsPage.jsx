import toast from 'react-hot-toast'
import SavedTrips from '../components/SavedTrips'
import { useTravel } from '../utils/TravelContext'
import { useI18n } from '../utils/I18nContext'

function SavedTripsPage() {
  const { savedTrips, deleteSavedTrip } = useTravel()
  const { t } = useI18n()

  const handleDelete = (trip) => {
    deleteSavedTrip(trip)
    toast.success('Trip deleted successfully!')
  }

  const totalDays = savedTrips.reduce((acc, trip) => acc + (trip.itinerary?.length || 0), 0)
  const totalDestinations = new Set(savedTrips.map((trip) => trip.summary?.Destination)).size

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.savedTripsTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Your saved itineraries and destination plans in one place.</p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-soft p-4 text-center">
          <p className="text-3xl font-bold text-primary dark:text-accent">
            {savedTrips.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Trips Saved
          </p>
        </div>
        <div className="card-soft p-4 text-center">
          <p className="text-3xl font-bold text-primary dark:text-accent">
            {totalDays}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total Days Planned
          </p>
        </div>
        <div className="card-soft p-4 text-center">
          <p className="text-3xl font-bold text-primary dark:text-accent">
            {totalDestinations}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Unique Destinations
          </p>
        </div>
      </div>

      {savedTrips.length === 0 ? (
        <div className="card-surface p-10 text-center space-y-3">
          <p className="text-4xl">🗺️</p>
          <p className="heading-text text-xl">No Saved Trips Yet!</p>
          <p className="muted-text text-sm">
            Plan your first trip and save it here.
          </p>
          <a href="/trip-planner" className="btn-gradient text-sm inline-block mt-2">
            Plan a Trip →
          </a>
        </div>
      ) : (
        <SavedTrips trips={savedTrips} onDelete={handleDelete} />
      )}
    </section>
  )
}

export default SavedTripsPage