import DashView from '@/views/auth/DashView.vue'
import HomeView from '@/views/auth/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthUserStore } from '@/stores/authUser'
// import { isAuthenticated } from '@/utils/supabase'

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
// router.beforeEach(async (to) => {
//   // Use Pinia Store
//   const authStore = useAuthUserStore()
//   // Load if user is logged in
//   const isLoggedIn = await isAuthenticated()

//   // Redirect to appropriate page if accessing home route
//   if (to.name === 'home') {
//     return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
//   }

//   // If logged in, prevent access to login or register pages
//   if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
//     // redirect the user to the dashboard page
//     return { name: 'dashboard' }
//   }

//   // If not logged in, prevent access to system pages
//   if (!isLoggedIn && to.meta.requiresAuth) {
//     // redirect the user to the login page
//     return { name: 'login' }
//   }

//   // Check if the user is logged in
//   if (isLoggedIn) {
//     // Load user data if not already done
//     if (!authStore.userData) {
//       await authStore.getUserInformation()
//     }

//     // Get the user role
//     const isAdmin = authStore.userData.is_admin

//     // Restrict access to admin-only routes
//     if (!isAdmin && to.meta.requiresAdmin) {
//       return { name: 'forbidden' }
//     }
//   }
// })

export default router
