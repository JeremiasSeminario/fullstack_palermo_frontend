import api from './axiosConfig'

export default {
  async createRentals(rentalsData) {
    const response = await api.post('/rentals', rentalsData)
    return response.data
  },

  async cancelRental(rentalId) {
    const response = await api.patch(`/rentals/cancel/${rentalId}`)
    return response.data
  },

  async cancelByStorm(rentalId) {
    const response = await api.patch(`/rentals/cancel-storm/${rentalId}`)
    return response.data
  }
}
