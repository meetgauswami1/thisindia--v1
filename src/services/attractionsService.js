import axios from "axios";

const fsqKey = import.meta.env.VITE_FOURSQUARE_API_KEY;

export async function fetchAttractions({ lat, lng }) {
  if (!fsqKey) return [];

  try {
    const { data } = await axios.get(
      "https://places-api.foursquare.com/places/search",
      {
        params: {
          ll: `${lat},${lng}`,
          categories: "16000",
          limit: 20
        },
        headers: {
          Authorization: `Bearer ${fsqKey}`,
          Accept: "application/json",
          "X-Places-Api-Version": "2025-06-17"
        }
      }
    );

    console.log("Attractions response:", data);

    return (data.results || []).map((place) => ({
      id: place.fsq_id,
      name: place.name,
      rating: place.rating || 0,
      totalRatings: place.stats?.total_ratings || 0,
      description: place.location?.formatted_address || "Tourist attraction",
      location: {
        lat: place.geocodes?.main?.latitude,
        lng: place.geocodes?.main?.longitude
      },
      image: null
    }));

  } catch (error) {
    console.error("Foursquare error:", error);
    return [];
  }
}