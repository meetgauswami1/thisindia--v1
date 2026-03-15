import axios from 'axios'

const imageClient = axios.create({
  baseURL: 'https://api.thisindia.app/images',
  timeout: 8000,
})

export const fetchDestinationImages = async (destinationId) => {
  const response = await imageClient.get(`/destinations/${destinationId}`)
  return response.data
}

export default imageClient
