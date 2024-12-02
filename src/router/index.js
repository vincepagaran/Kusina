import { isAuthenticated } from '@/utils/supabase'
import DashView from '@/views/auth/DashView.vue'
import HomeView from '@/views/system/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DishesView from '@/views/system/DishesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MenuDishes from '@/views/system/MenuDishes.vue'
import AccountSettings from '@/components/system/AccountSettings.vue'
import BreakfastView from '@/components/categories/BreakfastView.vue'
import FinishDishes from '@/views/system/FinishDishes.vue'
import DessertView from '@/components/categories/DessertView.vue'
import VegetarianView from '@/components/categories/VegetarianView.vue'
import SeafoodView from '@/components/categories/SeafoodView.vue'

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
    {
      path: '/dishes',
      name: 'dishes',
      component: DishesView,
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuDishes,
    },
    {
      path: '/finishdishes',
      name: 'finishdishes',
      component: FinishDishes,
    },
    {
      path: '/breakfast',
      name: 'breakfast',
      component: BreakfastView, // Add route for BreakfastView
    },
    {
      path: '/dessert',
      name: 'dessert',
      component: DessertView, // Add route for DessertView
    },
    {
      path: '/vegetarian',
      name: 'vegetarian',
      component: VegetarianView, // Add route for VegetarianView
    },
    {
      path: '/seafood',
      name: 'seafood',
      component: SeafoodView, // Add route for SeafoodView
    },
    {
      path: '/account/settings',
      name: 'accountsettings',
      component: AccountSettings,
      meta: { requiresAuth: true },
    },

  ],
})
router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()


if (to.name === '') {
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
