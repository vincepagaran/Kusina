import { isAuthenticated } from '@/utils/supabase'
import DashView from '@/views/auth/DashView.vue'
import HomeView from '@/views/system/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthUserStore } from '@/stores/authUser'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dash',
      component: DashView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      
    },
  ],
})
router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()

if (to.name === 'dash') {
  return isLoggedIn ? { name: 'home' } : { name: 'login' }
}

if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
  return { name: 'home' }
}

if (!isLoggedIn && to.path.startsWith ('/system')){
  return {name: 'login'}
}






})

export default router
