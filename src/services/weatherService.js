import axios from "axios"

const weatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY

export async function fetchWeather({ lat, lng }) {
  if (!weatherKey || !lat || !lng) {
    return null
  }

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat,
          lon: lng,
          appid: weatherKey,
          units: "metric"
        }
      }),
      axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: {
          lat,
          lon: lng,
          appid: weatherKey,
          units: "metric"
        }
      })
    ])

    const current = currentResponse.data
    const forecast = forecastResponse.data

    const dailyForecast = (forecast.list || [])
      .filter(item => item.dt_txt.includes("12:00:00"))
      .slice(0, 5)

    return {
      current: {
        temperature: current.main?.temp,
        condition: current.weather?.[0]?.main,
        humidity: current.main?.humidity,
        windSpeed: current.wind?.speed
      },
      forecast: dailyForecast.map(item => ({
        date: item.dt_txt.split(" ")[0],
        temperature: item.main?.temp,
        condition: item.weather?.[0]?.main
      }))
    }

  } catch (error) {
    console.error("Weather API error:", error)
    return null
  }
}