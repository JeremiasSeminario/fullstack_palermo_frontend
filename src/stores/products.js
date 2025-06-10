import { ref } from 'vue'
import { defineStore } from 'pinia'
import productService from '../api/productService'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])

  async function loadProducts() {
    const backendProducts = await productService.getProducts()
    products.value = backendProducts.map(p => {
      // Generar accesorios requeridos según la consigna
      const accessories = [
        ...(p.requirements?.requiresHelmet ? [{ id: 'helmet', name: 'Casco', required: true }] : []),
        ...(p.requirements?.requiresLifeJacket ? [{ id: 'lifeJacket', name: 'Chaleco salvavidas', required: true }] : [])
      ]
      return {
        id: p._id,
        name: p.name,
        description: p.description,
        image: getImages(p.name),
        price: p.price,
        maxPersons: p.maxPeople,
        requirements: p.requirements || {},
        requiredAccessories: accessories, // <-- AGREGA ESTA LÍNEA
        timeSlots: generateTimeSlots()
      }
    })
  }

  // Helper para imágenes por defecto
  const getImages = (productName) => {
    const images = {
      'Jetski': 'https://images.pexels.com/photos/8609596/pexels-photo-8609596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'Cuatriciclo': 'https://images.pexels.com/photos/18158099/pexels-photo-18158099/free-photo-of-hombre-conduciendo-un-quad-por-un-campo.jpeg',
      'Equipo de Buceo': 'https://images.pexels.com/photos/37530/divers-scuba-divers-diving-underwater-37530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'Tabla de Surf (Adultos)': 'https://images.pexels.com/photos/13581283/pexels-photo-13581283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'Tabla de Surf (Niños)': 'https://images.pexels.com/photos/6299949/pexels-photo-6299949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
    return images[productName] || ''
  }

  function getProductById(id) {
    return products.value.find(p => p.id === id)
  }

  async function getAvailableTimeSlots(productId, date) {
    const res = await productService.getAvailableSlots(productId, date)
    // El backend devuelve { slots: [{startTime, endTime}, ...] }
    return (res.slots || []).map(s => s.startTime)
  }

  function generateTimeSlots() {
    const slots = []
    for (let h = 8; h < 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`)
      slots.push(`${h.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  return { products, loadProducts, getProductById, getAvailableTimeSlots }
})