import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TravelContext = createContext(null)
const SAVED_TRIPS_KEY = 'savedTrips'

export const TravelProvider = ({ children }) => {
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_TRIPS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [savedDestinations, setSavedDestinations] = useState([])

  useEffect(() => {
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
  }, [savedTrips])

  const addSavedTrip = (trip) => {
    const generatedOn = new Date()
    setSavedTrips((prev) => [
      {
        id: crypto.randomUUID(),
        tripName: `${trip.summary.destination} Explorer`,
        destination: trip.summary.destination,
        duration: trip.summary.duration,
        dateSaved: generatedOn.toLocaleDateString(),
        travelDates: {
          generatedOn: generatedOn.toISOString(),
          duration: trip.summary.duration,
        },
        itinerary: trip.itinerary,
        generatedTripDetails: trip.summary,
        payload: trip,
      },
      ...prev,
    ])
  }

  const deleteSavedTrip = (tripId) => {
    setSavedTrips((prev) => prev.filter((trip) => trip.id !== tripId))
  }

  const saveDestination = (destination) => {
    setSavedDestinations((prev) => {
      if (prev.some((item) => item.id === destination.id)) {
        return prev
      }
      return [destination, ...prev]
    })
  }

  const value = useMemo(
    () => ({
      savedTrips,
      addSavedTrip,
      deleteSavedTrip,
      savedDestinations,
      saveDestination,
    }),
    [savedTrips, savedDestinations],
  )

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
}

export const useTravel = () => useContext(TravelContext)
