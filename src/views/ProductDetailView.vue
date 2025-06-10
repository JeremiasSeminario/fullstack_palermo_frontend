<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useReservationsStore } from '../stores/reservations'
import DateTimeSelector from '../components/reservation/DateTimeSelector.vue'
import AccessorySelector from '../components/reservation/AccessorySelector.vue'
import PersonSelector from '../components/reservation/PersonSelector.vue'
import CartSidebar from '../components/cart/CartSideBar.vue'
import rentalService from '../api/rentalService'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const reservationsStore = useReservationsStore()

const productId = route.params.id
const isLoading = computed(() => productsStore.products.length === 0)

const product = computed(() => {
  return productsStore.getProductById(productId)
})

// Producto Existe?
onMounted(() => {
  if (!product.value) {
    router.push('/')
  }
})

// Form data
const selectedAccessories = ref([])
const personCount = ref(1)
const sending = ref(false)
const success = ref(false)
const error = ref('')

// Create cart item ID reference
const cartItemId = ref(null)

// If we're editing an existing cart item
const editMode = ref(false)

onMounted(() => {
  if (route.query.edit) {
    const itemId = parseInt(route.query.edit)
    const cartItem = cartStore.cartItems.find(item => item.id === itemId)
    
    if (cartItem && cartItem.productId === productId) {
      editMode.value = true
      cartItemId.value = itemId
      
      // Populate form with existing data
      selectedAccessories.value = cartItem.accessories
      personCount.value = cartItem.persons
      
      // Set reservation details into the store
      const details = cartStore.reservationDetails[itemId]
      if (details) {
        reservationsStore.setDate(details.date)
        reservationsStore.setStartTime(details.startTime)
        reservationsStore.setEndTime(details.endTime)
      }
    }
  }
})

function updateAccessories(accessories) {
  selectedAccessories.value = accessories
}

function updatePersonCount(count) {
  personCount.value = count
}

function isFormValid() {
  return (
    product.value &&
    reservationsStore.date &&
    Array.isArray(reservationsStore.slots) &&
    reservationsStore.slots.length > 0
  )
}

async function reservar() {
  sending.value = true
  error.value = ''
  try {
    const slots = reservationsStore.slots
    if (!slots.length) throw new Error('Selecciona al menos un horario')
    const reservas = slots.map(slot => ({
      product: productId,
      customer: 'cliente1', // reemplaza por el id real
      date: reservationsStore.date,
      startTime: slot,
      endTime: sumar30(slot),
      peopleCount: personCount.value,
      paymentMethod: 'cash',
      isPaid: false,
      currency: 'ARS'
    }))
    await rentalService.createRentals(reservas)
    success.value = true
  } catch (e) {
    error.value = e.message
  }
  sending.value = false
}

function sumar30(slot) {
  const [h, m] = slot.split(':').map(Number)
  let date = new Date()
  date.setHours(h, m + 30)
  return date.toTimeString().slice(0,5)
}

function addToCart() {
  if (!isFormValid()) return

  const details = {
    date: reservationsStore.date,
    startTime: reservationsStore.startTime,
    endTime: reservationsStore.endTime,
    slots: reservationsStore.slots // <-- Guarda los slots seleccionados
  }

  if (editMode.value && cartItemId.value) {
    const item = cartStore.cartItems.find(item => item.id === cartItemId.value)
    if (item) {
      item.accessories = selectedAccessories.value
      item.persons = personCount.value
      cartStore.setReservationDetails(cartItemId.value, details)
    }
  } else {
    const newItemId = cartStore.addToCart(productId)
    if (newItemId) {
      cartItemId.value = newItemId
      const item = cartStore.cartItems.find(item => item.id === newItemId)
      if (item) {
        item.accessories = selectedAccessories.value
        item.persons = personCount.value
      }
      cartStore.setReservationDetails(newItemId, details)
    }
  }

  router.push('/')
}

// Computed property to check if the product is already in the cart
const isInCart = computed(() =>
  cartStore.cartItems.some(item => item.productId === productId)
)
</script>

<template>
  <div v-if="isLoading">
    <p>Cargando producto...</p>
  </div>

  <div v-else-if="product" class="product-detail-view">
    <div class="product-detail-container">
      <div class="product-info-section">
        <div class="product-header">
          <router-link to="/" class="back-link">
            &larr; Volver a productos
          </router-link>
          <h2>{{ product.name }}</h2>
        </div>
        
        <div class="product-content">
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
          </div>
          
          <div class="product-description">
            <p>{{ product.description }}</p>
            <p class="product-price">${{ product.price }} / 30 min</p>
          </div>
        </div>
      </div>
      
      <div class="reservation-form-section">
        <h3>Detalles de la Reserva</h3>
        
        <AccessorySelector 
          v-if="product?.requiredAccessories && product.requiredAccessories.length > 0"
          :accessories="product.requiredAccessories"
          :initialSelected="selectedAccessories"
          @update="updateAccessories"
        />
        
        <PersonSelector 
          :productId="productId"
          :initialValue="personCount"
          @update="updatePersonCount"
        />
        
        <DateTimeSelector :productId="productId" />
        
        <div class="form-actions">
          <button 
            @click="addToCart" 
            class="add-to-cart-button"
            :disabled="!isFormValid() || isInCart"
          >
            {{ editMode ? 'Actualizar reserva' : (isInCart ? 'Ya en carrito' : 'Agregar al carrito') }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="cart-sidebar-container">
      <CartSidebar />
    </div>
  </div>

  <div v-else class="product-not-found">
    <h2>Producto no encontrado</h2>
    <p>Lo sentimos, el producto que estás buscando no existe.</p>
    <router-link to="/">
      <button>Volver a la página principal</button>
    </router-link>
  </div>

  <div v-if="sending">Enviando reserva...</div>
  <div v-if="success">¡Reserva exitosa!</div>
  <div v-if="error" style="color:red">{{ error }}</div>
</template>

<style scoped>
.product-detail-view {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.product-detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.product-header {
  margin-bottom: var(--space-lg);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-md);
  color: var(--color-primary);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.product-header h2 {
  color: var(--color-primary-dark);
  margin: 0;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

.product-image {
  height: 300px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-description {
  color: var(--color-primary-dark);
}

.product-price {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-primary);
  margin-top: var(--space-md);
}

.reservation-form-section {
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.reservation-form-section h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-primary-dark);
}

.form-actions {
  margin-top: var(--space-xl);
}

.add-to-cart-button {
  width: 100%;
  padding: var(--space-md);
  font-size: var(--font-size-lg);
}

.add-to-cart-button:disabled,
.add-to-cart-button:disabled:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  cursor: not-allowed;
  filter: none;
  box-shadow: none;
  opacity: 0.6;
}

.product-not-found {
  text-align: center;
  padding: var(--space-xxl) 0;
}

.product-not-found h2 {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-md);
}

.product-not-found p {
  color: var(--color-gray);
  margin-bottom: var(--space-lg);
}

@media (min-width: 768px) {
  .product-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 992px) {
  .product-detail-view {
    grid-template-columns: 2fr 1fr;
  }
  
  .cart-sidebar-container {
    position: sticky;
    top: var(--space-lg);
  }
}
</style>