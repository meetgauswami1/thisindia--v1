import axios from "axios"

const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY

export async function fetchDestinationImages(query, count = 10) {

  if (!unsplashKey) {
    console.error("Unsplash API key missing")
    return []
  }

  // Fix long location labels like:
  // "Hyderabad, Hyderābād, India"
  const cleanQuery = query.split(",")[0].trim()

  try {

    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: cleanQuery,
          per_page: count
        },
        headers: {
          Authorization: `Client-ID ${unsplashKey}`
        }
      }
    )

    return response.data.results.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      photographer: img.user.name
    }))

  } catch (error) {
    console.error("Image API error:", error)
    return []
  }
}