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
        apiKey: '0ac701cbbe4d4121bb3f2aeb0262f43d', // Replace with your API key
        number: 10, // Fetch 10 recipes
      },
    })

    const randomRecipes = recipeResponse.data.recipes

    // Fetch details for each recipe
    const recipeDetailsRequests = randomRecipes.map(recipe =>
      axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: '0ac701cbbe4d4121bb3f2aeb0262f43d', // Replace with your API key
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
        apiKey: '0ac701cbbe4d4121bb3f2aeb0262f43d', // Replace with your API key
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
        apiKey: '0ac701cbbe4d4121bb3f2aeb0262f43d', // Replace with your API key
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
      <v-main style="background: url(/pics/DishesBG.gif) no-repeat center center fixed; min-height: 100vh; background-size: cover;">
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
          <h1 class="text-center title-text" style=" color: #e2dfd0">
            What do you want to make?
          </h1>

          <v-container>
            <v-row>
              <v-col cols="12">
                <h1 style="color: #e2dfd0;">Food Recipes</h1>
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

<style scoped>
/* General styles */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #e2dfd0;
}

/* Search Bar Styling */
.search-bar {
  position: relative;
  margin-top: 1%;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background-color: #e2dfd0;
  color: #404258;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Title Styling */
.title-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 16px 0;
  color: #404258;
  text-align: center;
}

/* Recipe Card Styling */
v-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

v-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

v-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Dialog Content */
v-dialog {
  border-radius: 12px;
}

v-card-title {
  font-weight: bold;
  color: #333333;
}

v-card-text {
  color: #555555;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

li {
  font-size: 1rem;
  line-height: 1.5;
}

/* Loading Spinner */
v-progress-circular {
  display: block;
  margin: 20px auto;
}

/* Button Styling */
v-btn {
  background-color: #4caf50;
  color: white;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

v-btn:hover {
  background-color: #45a045;
}

/* Responsive Design */
@media (max-width: 600px) {
  .title-text {
    font-size: 1.8rem;
  }

  v-card {
    margin-bottom: 16px;
  }
}
</style>