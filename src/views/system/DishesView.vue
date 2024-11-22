<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

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

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout failed:', error.message)
  } else {
    router.replace('/login') // Redirect to login after logout
  }
}

// Watch and save drawer state
drawer.value = JSON.parse(localStorage.getItem('drawerState')) || false
</script>

<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title>
        <v-img src="/pics/logo.png" alt="Logo" width="50" class="mr-3"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Adjusted Search Bar -->
      <v-text-field
        v-model="searchQuery"
        label="Search for a dish"
        dense
        clearable
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search-bar"
      ></v-text-field>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          subtitle="sandra_a88@gmailcom"
          title="Sandra Adams"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" @click="router.push('/')"></v-list-item>
        <v-list-item
          prepend-icon="mdi-history"
          title="Recent recipes"
          value="recentrecipes"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-checkbox-marked-circle-outline"
          title="Finished recipes"
          value="finishedrecipes"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-food" title="Dishes/Recipes" value="dishes"></v-list-item>
        <v-list-item
          @click="logout"
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1 class="text-center title-text">What do you want to make?</h1>
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
  </v-app>
</template>

<style scoped>
.search-bar {
  max-height: 50px; /* Matches the default height of v-app-bar */
  width: 50px; /* Adjust as needed */
}
</style>
