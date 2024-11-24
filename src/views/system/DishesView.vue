<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const user = ref(null)
const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false) // Load state from localStorage

onMounted(async () => {
  const { data: currentUser, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    router.replace('/login') // Redirect to login if there's an error
  } else if (!currentUser) {
    router.replace('/login') // Redirect to login if no user is logged in
  } else {
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
      <v-main style="background-color: #e2dfd0; min-height: 100vh">
        <v-container>
          <!-- Search Bar -->
          <v-text-field
            v-model="searchQuery"
            label="Search for a dish"
            dense
            clearable
            prepend-inner-icon="mdi-magnify"
            hide-details
            class="search-bar"
            style="margin-bottom: 16px"
          ></v-text-field>

          <!-- Title -->
          <h1 class="text-center title-text" style="background-color: #e2dfd0; color: #404258">
            What do you want to make?
          </h1>

          <!-- Categories -->
          <v-row class="mt-4">
            <v-col v-for="(category, index) in categories" :key="index" cols="12" sm="3">
              <v-card class="category-card">
                <v-img :src="category.img" alt="Category Image" class="category-image"></v-img>
                <v-card-title class="text-center">{{ category.title }}</v-card-title>
                <v-card-actions class="justify-center">
                  <v-btn color="primary" @click="viewCategory(category.title)">View</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </AppLayout>
  </v-app>
</template>

<style>
.search-bar {
  position: absolute;
  right: 16px;
  top: 75px;
  width: 30%; /* Adjust the width as needed */
  background-color: #DADADA;
}
.title-text {
  margin-top: auto;
}
.category-card {
  transition: 0.3s;
}
.category-card:hover {
  transform: scale(1.05);
}
.category-image {
  height: 200px;
}
</style>
