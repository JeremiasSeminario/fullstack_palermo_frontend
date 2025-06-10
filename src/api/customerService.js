import api from './axiosConfig'

export default {
  async createOrGetCustomer(data) {
    try {
      const res = await api.post('/customers', data)
      return res.data.customer
    } catch (err) {
      // Revisar el mensaje de error real del backend
      const backendMsg = err?.response?.data?.error || ''
      if (backendMsg.includes('DNI')) {
        // Buscar cliente por DNI si ya existe
        const res = await api.get(`/customers/dni/${data.dni}`)
        return res.data.customers[0]
      }
      throw err
    }
  }
}