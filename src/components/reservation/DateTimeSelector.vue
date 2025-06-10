<script setup>
import { ref, computed, watch } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useReservationsStore } from '../../stores/reservations'
import { format, addDays, startOfDay, isAfter, addHours } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({ productId: String })
const productsStore = useProductsStore()
const reservationsStore = useReservationsStore()

const now = new Date()
const today = startOfDay(now)
const tomorrow = addDays(today, 1)
const dayAfter = addDays(today, 2)

function getDayName(date) {
  return format(date, 'EEEE', { locale: es }).replace(/^./, l => l.toUpperCase())
}

const availableDates = [
  { date: format(today, 'yyyy-MM-dd'), label:  getDayName(today), full: format(today, 'dd/MM/yyyy') },
  { date: format(tomorrow, 'yyyy-MM-dd'), label: getDayName(tomorrow), full: format(tomorrow, 'dd/MM/yyyy') },
  { date: format(dayAfter, 'yyyy-MM-dd'), label: getDayName(dayAfter), full: format(dayAfter, 'dd/MM/yyyy') }
]

const selectedDate = ref(availableDates[0].date)
const availableSlots = ref([])
const selectedSlots = ref([])

function generateTimeSlots() {
  // De 8:00 a 19:30 (no incluye 20:00)
  const slots = []
  for (let h = 8; h < 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  return slots
}

const allSlots = computed(() => productsStore.getProductById(props.productId)?.timeSlots || generateTimeSlots())

watch(selectedDate, async () => {
  selectedSlots.value = []
  let slots = await productsStore.getAvailableTimeSlots(props.productId, selectedDate.value)
  // Si la fecha es hoy, filtra los slots pasados
  if (selectedDate.value === format(today, 'yyyy-MM-dd')) {
    const min = addHours(new Date(), 0.5) // Usar la hora actual real
    slots = slots.filter(s => {
      const [h, m] = s.split(':').map(Number)
      const t = new Date(selectedDate.value + 'T' + s) // Construir hora completa
      return isAfter(t, min)
  })
}
  availableSlots.value = slots
}, { immediate: true })

function areConsecutive(selected, all) {
  if (selected.length <= 1) return true
  const indices = selected.map(s => all.indexOf(s)).sort((a, b) => a - b)
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) return false
  }
  return true
}

function toggleSlot(slot) {
  let newSelection
  if (selectedSlots.value.includes(slot)) {
    newSelection = selectedSlots.value.filter(s => s !== slot)
  } else if (selectedSlots.value.length < 3) {
    newSelection = [...selectedSlots.value, slot]
  } else {
    return
  }
  if (areConsecutive(newSelection, allSlots.value)) {
    selectedSlots.value = newSelection
    reservationsStore.setDate(selectedDate.value)
    reservationsStore.setSlots([...selectedSlots.value])
  }
}
</script>
<template>
  <div>
    <h4>Selecciona una fecha (próximas 48 horas)</h4>
    <div class="date-buttons">
      <button
        v-for="d in availableDates"
        :key="d.date"
        @click="selectedDate = d.date"
        :class="['date-button', { active: selectedDate === d.date }]"
      >
        <span class="date-label">{{ d.label }}</span>
        <span class="date-day">{{ d.day }}</span>
        <span class="date-full">{{ d.full }}</span>
      </button>
    </div>
    <h4>Selecciona horario (máximo 90 minutos)</h4>
    <div class="time-slots">
      <button
        v-for="slot in allSlots"
        :key="slot"
        @click="toggleSlot(slot)"
        :disabled="!availableSlots.includes(slot) && !selectedSlots.includes(slot) || (selectedSlots.length >= 3 && !selectedSlots.includes(slot))"
        :class="[
          'time-slot',
          { 
            selected: selectedSlots.includes(slot),
            disabled: (!availableSlots.includes(slot) && !selectedSlots.includes(slot)),
            maxed: (selectedSlots.length >= 3 && !selectedSlots.includes(slot))
          }
        ]"
      >{{ slot }}</button>
    </div>
  </div>
</template>

<style scoped>
h4 {
  margin-bottom: var(--space-md);
  color: var(--color-primary-dark);
}

.date-buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.date-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-light);
  color: var(--color-gray-dark);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  min-width: 110px;
  transition: background 0.2s, color 0.2s, border 0.2s;
  cursor: pointer;
}
.date-button.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
.date-label {
  font-weight: 500;
  font-size: var(--font-size-md);
}
.date-day {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}
.date-full {
  font-size: var(--font-size-sm);
  color: var(--color-gray-light);
}
.time-slots {
  margin-top: var(--space-lg);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}
.time-slot {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background-color: var(--color-light);
  color: var(--color-gray-dark);
  border: 1px solid var(--color-gray-light);
  transition: background 0.2s, color 0.2s, border 0.2s;
  cursor: pointer;
}

.time-slot.selected {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.time-slot.disabled {
  background-color: var(--color-gray-light);
  color: var(--color-gray);
  cursor: not-allowed;
  opacity: 1;
}

.time-slot.maxed:not(.selected) {
  color: var(--color-gray);
  cursor: not-allowed;
  opacity: 0.5;
}

.time-slot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>