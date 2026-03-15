import axios from 'axios'

const aiClient = axios.create({
  baseURL: 'https://api.thisindia.app/ai',
  timeout: 10000,
})

export const generateTripPlan = async (payload) => {
  const response = await aiClient.post('/trip-plan', payload)
  return response.data
}

export const sendAssistantMessage = async (prompt) => {
  const response = await aiClient.post('/assistant', { prompt })
  return response.data
}

export default aiClient
