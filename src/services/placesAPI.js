import axios from 'axios'

const placesClient = axios.create({
  baseURL: 'https://api.thisindia.app/places',
  timeout: 8000,
})

export const fetchHiddenDestinations = async (params = {}) => {
  const response = await placesClient.get('/', { params })
  return response.data
}

export const fetchDestinationById = async (id) => {
  const response = await placesClient.get(`/${id}`)
  return response.data
}

export default placesClient
