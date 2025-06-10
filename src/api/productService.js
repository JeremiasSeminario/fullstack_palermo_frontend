import api from './axiosConfig'

export default {
  async getProducts() {
    const response = await api.get('/products')
    return response.data.products || response.data || []
  },
  async getAvailableSlots(productId, date) {
    const response = await api.get(`/rentals/available-slots?productId=${productId}&date=${date}`)
    return response.data
  }
}