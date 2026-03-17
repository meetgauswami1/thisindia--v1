import { useEffect, useMemo, useState } from 'react'
import { FiExternalLink, FiSearch } from 'react-icons/fi'
import { fetchLocationSuggestions } from '../services/geocodingService'
import { useTravelData } from '../utils/TravelDataContext'
import { useI18n } from '../utils/I18nContext'

function FlightsList() {
  const { selectedLocation } = useTravelData()
  const { t } = useI18n()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [destinationTouched, setDestinationTouched] = useState(false)
  const [travelDate, setTravelDate] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [error, setError] = useState('')

  const defaultDestination = useMemo(() => {
    return selectedLocation?.label || ''
  }, [selectedLocation])

  useEffect(() => {
    if (origin) return
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          const result = await fetchLocationSuggestions(`${lat},${lng}`)
          if (result?.[0]?.label) {
            setOrigin(result[0].label)
          }
        } catch {
          return null
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 },
    )
  }, [origin])

  const handleSearch = () => {
    const extractIataOrCity = (value) => {
      const trimmed = value.trim()
      const iataMatch = trimmed.match(/\b([A-Z]{3})\b/)
      if (iataMatch?.[1]) {
        return iataMatch[1]
      }
      return trimmed
    }

    const from = origin.trim()
    const to = (destinationTouched ? destination : defaultDestination).trim()
    const date = travelDate.trim()
    if (!from || !to || !date) {
      setError('Please enter origin, destination, and date.')
      return
    }
    setError('')
    const passengerCount = Number(passengers)
    const passengerSuffix =
      Number.isFinite(passengerCount) && passengerCount > 0
        ? ` for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`
        : ''
    const query = `Flights from ${extractIataOrCity(from)} to ${extractIataOrCity(to)} on ${date}${passengerSuffix}`
    const link = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="space-y-4">
      <h2 className="heading-text text-2xl">{t('common.flightSearchTitle')}</h2>
      <div className="card-surface space-y-3 p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.origin')}</span>
            <input
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder="Origin city"
              className="input-surface w-full"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.destination')}</span>
            <input
              value={destinationTouched ? destination : defaultDestination}
              onChange={(event) => {
                setDestinationTouched(true)
                setDestination(event.target.value)
              }}
              placeholder="Destination city"
              className="input-surface w-full"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.date')}</span>
            <input
              type="date"
              value={travelDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) => setTravelDate(event.target.value)}
              className="input-surface w-full"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Passengers</span>
            <input
              type="number"
              min={1}
              value={passengers}
              onChange={(event) => setPassengers(event.target.value)}
              className="input-surface w-full"
              placeholder="1"
            />
          </label>
          <div className="flex items-end">
            <button onClick={handleSearch} className="btn-gradient flex w-full items-center justify-center gap-2 text-sm">
              <FiSearch />
              {t('common.searchFlights')}
            </button>
          </div>
        </div>
        <a
          href="https://www.google.com/travel/flights"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline dark:text-accent"
        >
          Open Google Flights directly
          <FiExternalLink />
        </a>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>
    </section>
  )
}

export default FlightsList
