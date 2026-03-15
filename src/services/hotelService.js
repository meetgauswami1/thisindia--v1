import axios from "axios"

const OVERPASS_URL = "https://overpass-api.de/api/interpreter"

const mapPlace = (item, type) => ({
  id: item.id,
  type,
  name: item.tags?.name || "Unknown",
  address: item.tags?.["addr:street"] || "Address unavailable",

  // fake values so UI filters work
  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
  priceLevel: Math.floor(Math.random() * 4) + 1, // 1 - 4

  location: {
    lat: item.lat || item.center?.lat,
    lng: item.lon || item.center?.lon
  }
})

export async function fetchNearbyStaysAndFood({ lat, lng }) {

  const query = `
[out:json];
(
  node["tourism"="hotel"](around:20000,${lat},${lng});
  way["tourism"="hotel"](around:20000,${lat},${lng});
  relation["tourism"="hotel"](around:20000,${lat},${lng});

  node["amenity"="restaurant"](around:20000,${lat},${lng});
  way["amenity"="restaurant"](around:20000,${lat},${lng});
  relation["amenity"="restaurant"](around:20000,${lat},${lng});

  node["amenity"="cafe"](around:20000,${lat},${lng});
  way["amenity"="cafe"](around:20000,${lat},${lng});
  relation["amenity"="cafe"](around:20000,${lat},${lng});

  node["tourism"~"hotel|guest_house|hostel"](around:20000,${lat},${lng});
node["amenity"~"restaurant|fast_food|food_court"](around:20000,${lat},${lng});
node["amenity"="cafe"](around:20000,${lat},${lng});
);
out center;
`

  try {

    const response = await axios.post(OVERPASS_URL, query)

    const elements = response.data.elements || []

    const hotels = elements
      .filter(e => e.tags?.tourism === "hotel")
      .map(e => mapPlace(e, "hotel"))

    const restaurants = elements
      .filter(e => e.tags?.amenity === "restaurant")
      .map(e => mapPlace(e, "restaurant"))

    const cafes = elements
      .filter(e => e.tags?.amenity === "cafe")
      .map(e => mapPlace(e, "cafe"))

    return {
      hotels: hotels.slice(0, 10),
      restaurants: restaurants.slice(0, 10),
      cafes: cafes.slice(0, 10)
    }

  } catch (error) {
    console.error("Overpass API error:", error)
    return { hotels: [], restaurants: [], cafes: [] }
  }
}