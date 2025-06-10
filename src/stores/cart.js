import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsStore } from './products'

export const useCartStore = defineStore('cart', () => {
  const productsStore = useProductsStore()

  const cartItems = ref([])
  const reservationDetails = ref({})

  const itemCount = computed(() => cartItems.value.length)

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      const product = productsStore.getProductById(item.productId)
      if (!product) return total

      const details = reservationDetails.value[item.id]
      const slots = details ? details.slots.length : 0

      // Base price calculation (price is per 30 minutes)
      let itemTotal = product.price * slots

      return total + itemTotal
    }, 0)
  })

  const hasDiscount = computed(() => {
    const uniqueProductIds = new Set(cartItems.value.map(item => item.productId))
    return uniqueProductIds.size > 1
  })

  const discount = computed(() => {
    if (!hasDiscount.value) return 0
    return subtotal.value * 0.1 // 10% discount
  })

  const total = computed(() => {
    const calculatedTotal = subtotal.value - discount.value
    return isNaN(calculatedTotal) ? 0 : calculatedTotal
  })

  function addToCart(productId) {
    // No permitir duplicados
    if (cartItems.value.some(item => item.productId === productId)) return null

    const product = productsStore.getProductById(productId)
    if (!product) return

    const cartItemId = Date.now() // Simple unique ID

    // Add required accessories by default
    const accessories = product.requiredAccessories.map(acc => ({
      id: acc.id,
      name: acc.name,
      required: acc.required
    }))

    cartItems.value.push({
      id: cartItemId,
      productId,
      accessories,
      persons: 1
    })

    return cartItemId
  }

  function removeFromCart(cartItemId) {
    const index = cartItems.value.findIndex(item => item.id === cartItemId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      delete reservationDetails.value[cartItemId]
    }
  }

  function updatePersonCount(cartItemId, count) {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (item) {
      const product = productsStore.getProductById(item.productId)
      const maxPersons = product ? product.maxPersons : 1
      item.persons = Math.min(Math.max(1, count), maxPersons)
    }
  }

  function setReservationDetails(cartItemId, details) {
    reservationDetails.value[cartItemId] = details
  }

  function clearCart() {
    cartItems.value = []
    reservationDetails.value = {}
  }

  return {
    cartItems,
    reservationDetails,
    itemCount,
    subtotal,
    hasDiscount,
    discount,
    total,
    addToCart,
    removeFromCart,
    updatePersonCount,
    setReservationDetails,
    clearCart
  }
})