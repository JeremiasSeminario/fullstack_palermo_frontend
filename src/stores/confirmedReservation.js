import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmedReservationStore = defineStore('confirmedReservation', () => {
  const summary = ref(null)

  function setSummary(data) {
    summary.value = data
  }

  function clearSummary() {
    summary.value = null
  }

  return { summary, setSummary, clearSummary }
})