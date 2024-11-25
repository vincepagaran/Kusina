<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';

const router = useRouter();
const user = ref(null);

// State variables
const recipes = ref([]); // Stores the fetched recipes
const loading = ref(false); // Indicates loading state
const searchQuery = ref(''); // Stores the user's search input
const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false); // Load state from localStorage

onMounted(async () => {
  const { data: currentUser, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error.message);
    router.replace('/login'); // Redirect to login if there's an error
  } else if (!currentUser) {
    router.replace('/login'); // Redirect to login if no user is logged in
  } else {
    user.value = currentUser.user;
  }
});

// Fetch recipes from the API
const fetchRecipes = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/random', {
      params: {
        apiKey: 'e7bbe0e97c144ffd86e6ec26e750b37e', // Replace with your API key
        number: 10, // Fetch 10 recipes
      },
    });
    recipes.value = response.data.recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
  } finally {
    loading.value = false;
  }
};

// Search recipes based on the query
const searchRecipes = async () => {
  if (!searchQuery.value) {
    await fetchRecipes(); // Fallback to random recipes if no search query
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: 'e7bbe0e97c144ffd86e6ec26e750b37e', // Replace with your API key
        query: searchQuery.value,
        number: 10, // Fetch 10 recipes
      },
    });
    recipes.value = response.data.results; // Use the `results` array for search API
  } catch (error) {
    console.error('Error searching recipes:', error);
  } finally {
    loading.value = false;
  }
};

// Handle viewing recipe details
const viewDetails = (recipeId) => {
  alert(`View details for recipe ID: ${recipeId}`);
};

// Watch searchQuery and trigger search automatically (optional)
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    fetchRecipes();
  }
});

// Fetch data when the component is mounted
onMounted(fetchRecipes)

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
            @keyup.enter="searchRecipes"
          ></v-text-field>

          <!-- Title -->
          <h1 class="text-center title-text" style="background-color: #e2dfd0; color: #404258">
            What do you want to make?
          </h1>

          <v-container>
            <v-row>
              <v-col cols="12">
                <h1>Food Recipes</h1>
              </v-col>

              <!-- Loading Spinner -->
              <v-col cols="12" v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-col>

              <!-- Display Recipes -->
              <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4">
                <v-card>
                  <v-img :src="recipe.image" height="200px"></v-img>
                  <v-card-title>{{ recipe.title }}</v-card-title>
                  <v-card-text>
                    <p>Cook Time: {{ recipe.cookTime }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="viewDetails(recipe.id)">View Details</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

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
  background-color: #dadada;
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
