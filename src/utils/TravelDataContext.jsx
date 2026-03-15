import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { fetchAttractions } from '../services/attractionsService'
import { fetchFlights } from '../services/flightService'
import { geocodeLocation } from '../services/geocodingService'
import { fetchNearbyStaysAndFood } from '../services/hotelService'
import { fetchDestinationImages } from '../services/imageService'
import { fetchWeather } from '../services/weatherService'

const TravelDataContext = createContext(null)

export function TravelDataProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [travelData, setTravelData] = useState({
    attractions: [],
    weather: null,
    hotels: [],
    restaurants: [],
    cafes: [],
    images: [],
    flights: [],
  })
  const [loadingState, setLoadingState] = useState({
    searchingLocation: false,
    fetchingData: false,
  })
  const [errors, setErrors] = useState({})
  const [activeMarkerId, setActiveMarkerId] = useState(null)
  const cacheRef = useRef(new Map())


  const loadDestinationData = useCallback(async (location) => {
  

    if (!location?.lat || !location?.lng) {
      return
    }

    const cacheKey = `${location.lat.toFixed(3)},${location.lng.toFixed(3)}`
    if (cacheRef.current.has(cacheKey)) {
      setTravelData(cacheRef.current.get(cacheKey))
      return
    }

    setLoadingState((prev) => ({ ...prev, fetchingData: true }))

    const [attractionsResult, weatherResult, staysFoodResult, imagesResult, flightsResult] =
      await Promise.allSettled([
        fetchAttractions({ lat: location.lat, lng: location.lng }),
        fetchWeather({ lat: location.lat, lng: location.lng }),
        fetchNearbyStaysAndFood({ lat: location.lat, lng: location.lng }),
        fetchDestinationImages(location.label, 14),
        fetchFlights({ destinationCode: location.label }),
      ])

          

    const nextData = {
      attractions: attractionsResult.status === 'fulfilled' ? attractionsResult.value : [],
      weather:
        weatherResult.status === "fulfilled" && weatherResult.value
          ? weatherResult.value
          : null,
      hotels: staysFoodResult.status === 'fulfilled' ? staysFoodResult.value.hotels : [],
      restaurants: staysFoodResult.status === 'fulfilled' ? staysFoodResult.value.restaurants : [],
      cafes: staysFoodResult.status === 'fulfilled' ? staysFoodResult.value.cafes : [],
      images: imagesResult.status === 'fulfilled' ? imagesResult.value : [],
      flights: flightsResult.status === 'fulfilled' ? flightsResult.value : [],
    }

    setTravelData(nextData)
    cacheRef.current.set(cacheKey, nextData)

    const nextErrors = {}
    if (attractionsResult.status === 'rejected') nextErrors.attractions = 'Failed to load attractions.'
    if (
      weatherResult.status === "rejected" ||
      !weatherResult.value
    ) {
      nextErrors.weather = "Failed to load weather."
    }
    if (staysFoodResult.status === 'rejected') nextErrors.hotels = 'Failed to load hotels and restaurants.'
    if (imagesResult.status === 'rejected') nextErrors.images = 'Failed to load destination images.'
    if (flightsResult.status === 'rejected') nextErrors.flights = 'Failed to load flights.'
    setErrors((prev) => ({ ...prev, ...nextErrors }))
    setLoadingState((prev) => ({ ...prev, fetchingData: false }))
  }, [])

  const setLocationAndLoad = useCallback(async (queryOrLocation) => {
    // console.log("Location search triggered:", queryOrLocation)

    setErrors({})
    setLoadingState((prev) => ({ ...prev, searchingLocation: true }))

    try {
      const location =
        typeof queryOrLocation === 'string' ? await geocodeLocation(queryOrLocation) : queryOrLocation
      setSelectedLocation(location)
      await loadDestinationData(location)
      return location
    } catch (error) {
      setErrors((prev) => ({ ...prev, location: error.message || 'Could not find location.' }))
      return null
    } finally {
      setLoadingState((prev) => ({ ...prev, searchingLocation: false }))
    }
  }, [loadDestinationData])

  const value = useMemo(
    () => ({
      selectedLocation,
      travelData,
      loadingState,
      errors,
      activeMarkerId,
      setActiveMarkerId,
      setLocationAndLoad,
      loadDestinationData,
    }),
    [selectedLocation, travelData, loadingState, errors, activeMarkerId, setLocationAndLoad, loadDestinationData],
  )

  return <TravelDataContext.Provider value={value}>{children}</TravelDataContext.Provider>
}

export function useTravelData() {
  return useContext(TravelDataContext)
}
