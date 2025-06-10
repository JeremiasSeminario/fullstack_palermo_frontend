import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCheckoutStore = defineStore('checkout', () => {
  const customerInfo = ref({
    name: '',
    email: '',
    dni: '',
    currency: 'local'
  })

  const paymentMethod = ref('cash') // 'cash' o 'card'

  function updateCustomerInfo(info) {
    customerInfo.value = { ...customerInfo.value, ...info }
  }

  function setPaymentMethod(method) {
    paymentMethod.value = method
  }

  function resetCheckout() {
    customerInfo.value = {
      name: '',
      email: '',
      dni: '',
      currency: 'local'
    }
    paymentMethod.value = 'cash'
  }

  return {
    customerInfo,
    paymentMethod,
    updateCustomerInfo,
    setPaymentMethod,
    resetCheckout
  }
})