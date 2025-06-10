const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/ProductListView.vue'),
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue')
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: () => import('../views/ConfirmationView.vue')
  }
]

export default routes;