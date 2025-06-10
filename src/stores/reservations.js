import { ref } from 'vue'
import { defineStore } from 'pinia'
import productService from '../api/productService'

export const useReservationsStore = defineStore('reservations', () => {
  const date = ref('')
  const slots = ref([])

  function setDate(newDate) { date.value = newDate }
  function setSlots(newSlots) { slots.value = newSlots }

  async function fetchAvailability(productId, date) {
    this.date = date
    const slots = await productService.getAvailableSlots(productId, date)
    this.slots = slots
    return slots
  }

  return { date, slots, setDate, setSlots, fetchAvailability }
})