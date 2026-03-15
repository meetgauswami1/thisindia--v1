import SavedTrips from '../components/SavedTrips'
import { useTravel } from '../utils/TravelContext'
import { useI18n } from '../utils/I18nContext'

function SavedTripsPage() {
  const { savedTrips, deleteSavedTrip } = useTravel()
  const { t } = useI18n()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.savedTripsTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Your saved itineraries and destination plans in one place.</p>
      </header>
      <SavedTrips trips={savedTrips} onDelete={deleteSavedTrip} />
    </section>
  )
}

export default SavedTripsPage
