<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const user = ref(null)

// State variables
const recipes = ref([]) // Stores the fetched recipes
const selectedRecipe = ref(null) // Stores detailed recipe information
const loading = ref(false) // Indicates loading state
const searchQuery = ref('') // Stores the user's search input
const dialog = ref(false)
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

// Fetch recipes and their details
const fetchRecipesWithDetails = async () => {
  loading.value = true

  try {
    const recipeResponse = await axios.get('https://api.spoonacular.com/recipes/random', {
      params: {
        apiKey: 'f79e60188f114e95ac5413f96d37d32f', // Replace with your API key
        number: 10, // Fetch 10 recipes
      },
    })

    const randomRecipes = recipeResponse.data.recipes

    // Fetch details for each recipe
    const recipeDetailsRequests = randomRecipes.map(recipe =>
      axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: 'f79e60188f114e95ac5413f96d37d32f', // Replace with your API key
        },
      })
    )

    const detailedResponses = await Promise.all(recipeDetailsRequests)
    recipes.value = detailedResponses.map((response) => response.data)

    // Extract recipe details and ingredients
    const recipeDetails = recipeResponse.data
    const ingredients = recipeDetails.extendedIngredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
    }))

    return {
      title: recipeDetails.title,
      image: recipeDetails.image,
      summary: recipeDetails.summary,
      ingredients,
      instructions: recipeDetails.instructions,
    }

  } catch (error) {
    console.error('Error fetching recipes:', error)
  } finally {
    loading.value = false
  }
}

// Search recipes based on the query
const searchRecipes = async () => {
  if (!searchQuery.value) {
    await fetchRecipesWithDetails() // Fallback to random recipes if no search query
    return
  }

  loading.value = true
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: 'f79e60188f114e95ac5413f96d37d32f', // Replace with your API key
        query: searchQuery.value,
        number: 10, // Fetch 10 recipes
      },
    })
    recipes.value = response.data.results // Use the results array for search API
  } catch (error) {
    console.error('Error searching recipes:', error)
  } finally {
    loading.value = false
  }
}

const viewDetails = async (recipeId) => {
  try {
    loading.value = true;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
      params: {
        apiKey: 'f79e60188f114e95ac5413f96d37d32f', // Replace with your API key
      },
    });

    const recipeDetails = response.data;

    // Extract necessary details and assign to selectedRecipe
    selectedRecipe.value = {
      id: recipeDetails.id,
      title: recipeDetails.title,
      image: recipeDetails.image,
      summary: recipeDetails.summary,
      ingredients: recipeDetails.extendedIngredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      instructions: recipeDetails.instructions,
    };

    dialog.value = true; // Open the dialog
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  } finally {
    loading.value = false;
  }
};

// Watch searchQuery and trigger search automatically (optional)
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    fetchRecipesWithDetails()
  }
})

// Function to close the dialog
const closeDialog = () => {
  selectedRecipe.value = null; // Reset selectedRecipe to close the dialog
}

// Fetch data when the component is mounted
onMounted(fetchRecipesWithDetails)

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
                  <v-card-actions>
                    <v-btn color="primary" @click="viewDetails(recipe.id)">View Details</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-dialog v-model="selectedRecipe" max-width="600px">
            <v-card v-if="selectedRecipe">
              <!-- Title -->
              <v-card-title>{{ selectedRecipe.title }}</v-card-title>

              <!-- Recipe Image -->
              <v-img :src="selectedRecipe.image" height="200px"></v-img>

              <!-- Recipe Details -->
              <v-card-text>
                <!-- Summary -->
                <p><strong>Summary:</strong></p>
                <div v-html="selectedRecipe.summary"></div>

                <!-- Ingredients -->
                <p><strong>Ingredients:</strong></p>
                <ul>
                  <li v-for="(ingredient, index) in selectedRecipe.ingredients" :key="index">
                    {{ ingredient.amount }} {{ ingredient.unit }} of {{ ingredient.name }}
                  </li>
                </ul>

                <!-- Instructions -->
                <p><strong>Instructions:</strong></p>
                <div v-html="selectedRecipe.instructions"></div>
              </v-card-text>

              <!-- Actions -->
              <v-card-actions>
                <v-btn color="primary" text @click="closeDialog">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
