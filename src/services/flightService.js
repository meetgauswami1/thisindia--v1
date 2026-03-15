import axios from 'axios'

const amadeusApiKey = import.meta.env.VITE_AMADEUS_API_KEY || import.meta.env.AMADEUS_API_KEY

export async function fetchFlights({ destinationCode }) {
  if (!amadeusApiKey || !destinationCode) {
    return []
  }

  const departureDate = new Date()
  departureDate.setDate(departureDate.getDate() + 15)
  const dateText = departureDate.toISOString().split('T')[0]

  try {
    const { data } = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: {
        originLocationCode: 'DEL',
        destinationLocationCode: destinationCode.toUpperCase().slice(0, 3),
        departureDate: dateText,
        adults: 1,
        max: 10,
      },
      headers: {
        Authorization: `Bearer ${amadeusApiKey}`,
      },
    })

    return (data.data || []).map((offer) => ({
      id: offer.id,
      airline: offer.validatingAirlineCodes?.[0] || 'Airline',
      departure: offer.itineraries?.[0]?.segments?.[0]?.departure?.at,
      arrival:
        offer.itineraries?.[0]?.segments?.[offer.itineraries?.[0]?.segments.length - 1]?.arrival?.at,
      price: offer.price?.total,
      currency: offer.price?.currency || 'USD',
    }))
  } catch {
    return []
  }
}
