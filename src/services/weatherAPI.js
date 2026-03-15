import axios from 'axios'

const weatherClient = axios.create({
  baseURL: 'https://api.thisindia.app/weather',
  timeout: 8000,
})

export const fetchForecastByDestination = async (destinationId) => {
  const response = await weatherClient.get(`/forecast/${destinationId}`)
  return response.data
}

export default weatherClient
