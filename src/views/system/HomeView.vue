<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthUserStore } from '@/stores/authUser';

const router = useRouter()
const authStore = useAuthUserStore()
const loading = ref(true)
const user = ref(null)
const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false) // Load state from localStorage

onMounted(async () => {
  const { data: currentUser, error } = await supabase.auth.getUser()
  if (!authStore.userData) {
    await authStore.getUserInformation()
  }else if (error) {
    console.error('Error fetching user:', error.message)
    router.replace('/login') // Redirect to login if there's an error
  } else if (!currentUser) {
    router.replace('/login') // Redirect to login if no user is logged in
  } else {
    loading.value = false;
    user.value = currentUser.user
  }
})

// Watch and save drawer state
drawer.value = JSON.parse(localStorage.getItem('drawerState')) || false
</script>

<template>
  <v-app>
    <AppLayout>
      <!-- Main Content -->
      <v-main style="background: url(/pics/CookingGIF.gif); min-height: 100vh; background-size: cover;">
        <v-container class="d-flex justify-start align-start" style="height: 100vh;">
          <!-- Content Section -->
          <v-row class="text-left" align="start" justify="start">
            <v-col cols="12" md="8">
              <!-- Header Section -->
              <h1 class="display-1 font-weight-bold text-uppercase" style="color: #ffff; margin-top: 250px;">
                Cook like<span class="highlight-text" style="color: #ffff;"> a Pro <br>with Our Simple Recipes</span>
              </h1>
              <!-- Button Section -->
              <div class="button mt-6">
                <v-btn
                  @click="navigateTo('/dishes')"
                  class="view-dishes-btn"
                  color="#e2dfd0"
                  large
                  style="transition: background-color 0.3s ease, transform 0.2s ease; width: 250px; height: 50px; border-radius: 0;"
                  @mouseover="hover = true"
                  @mouseleave="hover = false"
                  :style="{ transform: hover ? 'scale(1.05)' : 'scale(1)' }"
                >
                  View Dishes
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </AppLayout>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.highlight-text {
  color: #f44336; /* Red color for emphasis */
}

.view-dishes-btn {
  background-color: #1976d2; /* Primary color */
}

.view-dishes-btn:hover {
  background-color: #1565c0; /* Darker shade on hover */
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .display-1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 600px) {
  .display-1 {
    font-size: 2rem;
  }
}
</style>
