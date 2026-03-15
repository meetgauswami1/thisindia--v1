import axios from 'axios'

const opencageKey = import.meta.env.VITE_OPENCAGE_API_KEY || import.meta.env.OPENCAGE_API_KEY

export async function fetchLocationSuggestions(query) {
  if (!query || query.trim().length < 3) return []
  if (!opencageKey) return []

  try {
    const { data } = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: opencageKey,
          q: query,
          limit: 8,
          no_annotations: 1,
          pretty: 0,
        },
      }
    )

    return (data.results || []).map((result) => ({
      id: result.annotations?.geohash || result.geometry?.lat + "-" + result.geometry?.lng,
      label: result.formatted,
      lat: result.geometry?.lat,
      lng: result.geometry?.lng,
      country: result.components?.country,
    }))
  } catch (error) {
    console.error("Geocoding API error:", error)
    return []
  }
}

export async function geocodeLocation(query) {
  const suggestions = await fetchLocationSuggestions(query)
  if (!suggestions.length) {
    throw new Error('No location found for this search')
  }
  return suggestions[0]
}
