import { createRouter, createWebHistory } from 'vue-router'
import routes from './router.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
