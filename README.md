# Trabajo Práctico Integrador - Etapa Frontend
### Profesora: MARÍA BELÉN ALEGRE

### Alumno:
    Jeremias Seminario
    Legajo: 0118252

### Instalación:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

```
frontend
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ iconoup.ico
├─ README.md
├─ src
│  ├─ api
│  │  ├─ axiosConfig.js
│  │  ├─ customerService.js
│  │  ├─ productService.js
│  │  └─ rentalService.js
│  ├─ App.vue
│  ├─ assets
│  │  └─ main.css
│  ├─ components
│  │  ├─ cart
│  │  │  ├─ CartItem.vue
│  │  │  └─ CartSideBar.vue
│  │  ├─ checkout
│  │  │  ├─ CustomerInfoForm.vue
│  │  │  ├─ PaymentMethodSelector.vue
│  │  │  └─ ReservationSummary.vue
│  │  ├─ layout
│  │  │  └─ Header.vue
│  │  ├─ products
│  │  │  └─ ProductCard.vue
│  │  └─ reservation
│  │     ├─ AccessorySelector.vue
│  │     ├─ DateTimeSelector.vue
│  │     └─ PersonSelector.vue
│  ├─ main.js
│  ├─ router
│  │  ├─ index.js
│  │  └─ router.js
│  ├─ stores
│  │  ├─ cart.js
│  │  ├─ checkout.js
│  │  ├─ confirmedReservation.js
│  │  ├─ products.js
│  │  └─ reservations.js
│  └─ views
│     ├─ CheckoutView.vue
│     ├─ ConfirmationView.vue
│     ├─ ProductDetailView.vue
│     └─ ProductListView.vue
└─ vite.config.js

```