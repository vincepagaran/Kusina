<script setup>
import { ref, onMounted } from 'vue';
import { isAuthenticated, supabase } from '@/utils/supabase';
import { useRouter } from 'vue-router';
import ProfileHeader from './ProfileHeader.vue'

const router = useRouter()
const user = ref(false)
const isLoggedIn = ref(false)
const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false)

// Fetch user on mount
onMounted(async () => {
  const { data: currentUser, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message);
    router.replace('/login'); // Redirect to login if error occurs
  } else if (!currentUser) {
    router.replace('/login'); // Redirect if no user is logged in
  } else {
    user.value = currentUser.user;
  }
});

const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

drawer.value = JSON.parse(localStorage.getItem('drawerState')) || false

onMounted(()=> {
  getLoggedStatus()
})
</script>

<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar style="background-color: #558B2F; color: #FFFFFF;" app>
      <v-btn icon @click="drawer = !drawer" style=" transition: 0.3s;"
  class="hover-btn">
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
      style="background-color: #7CB342; color: #e5e1da;"
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          variant="outlined"
          @click="router.push('/home')"
          style="color: #F6FCDF;">
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-history"
          title="Recent Recipes"
          variant="outlined"
          @click="router.push('/recentrecipes')"
          style="color: #F6FCDF;">
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-checkbox-marked-circle-outline"
          title="Finished Recipes"
          variant="outlined"
          @click="router.push('/finishedrecipes')"
          style="color: #F6FCDF;">
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-food"
          title="Dishes/Recipes"
          variant="outlined"
          @click="router.push('/dishes')"
          style="color: #F6FCDF;">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main style="background-color: #E8F5E9; color: #1D3557;">
      <slot></slot>
    </v-main>

    <!-- Footer -->
    <v-footer app style="background-color: #1B5E20; color: #FFFFFF;">
      <v-col class="text-center">© {{ new Date().getFullYear() }} Recipe Application</v-col>
    </v-footer>
  </v-app>
</template>

<style scoped>
.hover-btn:hover {
  background-color: #C9A227; /* Gold background on hover */
  color: #121212; /* Rich Black icon color on hover */
  transition: background-color 0.3s, color 0.3s; /* Smooth transition effect */
  border-radius: 50%; /* Optional: Circular button effect on hover */
}
</style>




