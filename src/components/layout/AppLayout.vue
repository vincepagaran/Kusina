<script setup>
import { ref, onMounted } from 'vue'
import { isAuthenticated, supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import ProfileHeader from './ProfileHeader.vue'

const router = useRouter()
const user = ref(false)
const isLoggedIn = ref(false)
const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false)

// Fetch user on mount
onMounted(async () => {
  const { data: currentUser, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    router.replace('/login') // Redirect to login if error occurs
  } else if (!currentUser) {
    router.replace('/login') // Redirect if no user is logged in
  } else {
    user.value = currentUser.user
  }
})

const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

drawer.value = JSON.parse(localStorage.getItem('drawerState')) || false

onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-responsive max-height="auto">
    <v-app>
      <!-- Navbar -->
      <v-app-bar
        style="background-color: transparent; backdrop-filter: blur(25px); color: #f6fcdf"
        app
      >
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-img src="/pics/logo.png" alt="Logo" width="50" class="mr-3"></v-img>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        expand-on-hover
        rail
        app
        style="background-color: transparent; backdrop-filter: blur(25px); color: #f6fcdf"
      >
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            variant="outlined"
            style="background-color: #A59D84; margin-bottom: 8px; border-radius: 4px"
            @click="router.push('/home')"
          >
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-history"
            title="Recent Recipes"
            variant="outlined"
            style="background-color: #A59D84; margin-bottom: 8px; border-radius: 4px"
            @click="router.push('/recentrecipes')"
          >
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-checkbox-marked-circle-outline"
            title="Finished Recipes"
            variant="outlined"
            style="background-color: #A59D84; margin-bottom: 8px; border-radius: 4px"
            @click="router.push('/finishedrecipes')"
          >
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-food"
            title="Dishes/Recipes"
            variant="outlined"
            style="background-color: #A59D84; border-radius: 4px"
            @click="router.push('/dishes')"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main
        style="
          min-height: 100vh;
          background: url(/pics/bg3.jpg) no-repeat center fixed;
          background-size: cover;
        "
      >
        <slot></slot>
      </v-main>

      <!-- Footer -->
      <v-footer
        app
        style="background: rgba(64, 64, 64, 0.15); backdrop-filter: blur(25px); color: #e2dfd0"
      >
        <v-col class="text-center">© {{ new Date().getFullYear() }} Recipe Application</v-col>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.list {
  background-color: #ffffff;
  color: #1b1833;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.list:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease-in-out;
}

.v-navigation-drawer {
  scrollbar-width: thin;
  scrollbar-color: #ffffff rgba(255, 255, 255, 0.2);
}

.v-navigation-drawer::-webkit-scrollbar {
  width: 6px;
}

.v-navigation-drawer::-webkit-scrollbar-thumb {
  background: #ffffff;
  border-radius: 3px;
}

.v-navigation-drawer::-webkit-scrollbar-track {
  background: transparent;
}
</style>
