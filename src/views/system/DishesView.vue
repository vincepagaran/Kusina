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
        apiKey: '46a2a3cda1bd4922a2c7bcfbbe1d3f13', // Replace with your API key
        number: 10, // Fetch 10 recipes
      },
    })

    const randomRecipes = recipeResponse.data.recipes

    // Fetch details for each recipe
    const recipeDetailsRequests = randomRecipes.map(recipe =>
      axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: 'e7bbe0e97c144ffd86e6ec26e750b37e', // Replace with your API key
        },
      })
    )

    const detailedResponses = await Promise.all(recipeDetailsRequests)
    recipes.value = detailedResponses.map((response) => response.data)
  } catch (error) {
    console.error('Error fetching recipes:', error)
  } finally {
    loading.value = false
  }
}

const addToMenu = (recipe) => {
  // Retrieve the existing menu items from localStorage
  const savedMenuItems = JSON.parse(localStorage.getItem('menuItems')) || []

  // Add the new recipe to the array
  savedMenuItems.push(recipe)

  // Save the updated array back to localStorage
  localStorage.setItem('menuItems', JSON.stringify(savedMenuItems))

  // Navigate to the "Menu" page
  router.push({ name: 'menu' })  // No need to pass recipe in the route params
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

// View recipe details
const viewDetails = async (recipeId) => {
  try {
    loading.value = true
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
      params: {
        apiKey: 'f79e60188f114e95ac5413f96d37d32f', // Replace with your API key
      },
    })

    const recipeDetails = response.data
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
    }

    dialog.value = true // Open the dialog
  } catch (error) {
    console.error('Error fetching recipe details:', error)
  } finally {
    loading.value = false
  }
}

// Watch searchQuery and trigger search automatically (optional)
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    fetchRecipesWithDetails()
  }
})

// Function to close the dialog
const closeDialog = () => {
  selectedRecipe.value = null
}

// Fetch data when the component is mounted
onMounted(fetchRecipesWithDetails)

// Watch and save drawer state
watch(drawer, (newState) => {
  localStorage.setItem('drawerState', JSON.stringify(newState))
})
</script>

<template>
  <v-app>
    <AppLayout>
      <!-- Main Content -->
      <v-main>
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
              <v-col cols="12" v-if="loading" style=" height: 100px;">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-col>

              <!-- Display Recipes -->
              <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4">
                <v-card>
                  <v-img :src="recipe.image" height="200px"></v-img>
                  <v-card-title>{{ recipe.title }}</v-card-title>
                  <v-card-actions style="position: absolute; bottom: 10px; right: 10px;">
                        <v-btn style="background-color: #8D6E63; color: #e2dfd0;" @click="viewDetails(recipe.id)">View Details</v-btn>
                    </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- Recipe Details Dialog -->
          <v-dialog v-model="selectedRecipe" max-width="600px">
            <v-card v-if="selectedRecipe">
              <!-- Title -->
              <v-card-title>{{ selectedRecipe.title }}</v-card-title>

              <!-- Recipe Image -->
              <v-img :src="selectedRecipe.image" height="200px"></v-img>

              <!-- Recipe Details -->
              <v-card-text>
                <p><strong>Summary:</strong></p>
                <div v-html="selectedRecipe.summary"></div>

                <p><strong>Ingredients:</strong></p>
                <ul>
                  <li v-for="(ingredient, index) in selectedRecipe.ingredients" :key="index">
                    {{ ingredient.amount }} {{ ingredient.unit }} of {{ ingredient.name }}
                  </li>
                </ul>

                <p><strong>Instructions:</strong></p>
                <div v-html="selectedRecipe.instructions"></div>
              </v-card-text>

              <!-- Actions -->
              <v-card-actions class="card-actions">
      <v-btn style="background-color: #8D6E63; color: #e2dfd0;" text @click="closeDialog">Close</v-btn>
      <v-btn style="background-color: #8D6E63; color: #e2dfd0;" @click="addToMenu(selectedRecipe)">Add to Menu</v-btn>
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
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
}

/* Search Bar Styling */
.search-bar {
  margin-top: none;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background-color: #ffffff;
  color: #1B1833;
  border-radius: 30px;
  transition: transform 0.2s ease-in-out;
}

.search-bar:hover {
  transform: scale(1.02);
}

/* Title Styling */
.title-text {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 20px 0;
  color: #555555;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Recipe Card Styling */
.v-card {
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  height: 50vh;
  background-color: #DCEDC8;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.v-img {
  margin-top: 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  object-fit: cover;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333333;
}

.v-card-actions {
  padding: 10px;
  justify-content: center;  /* Center the button horizontally */
  position: relative;
  bottom: 20px; /* Add space at the bottom */
  left: 50%;
  transform: translateX(-50%); /* Center the button horizontally */
  margin-top: -20px; /* Move the button up */
}

/* Dialog Content */
/* .v-dialog {
  border-radius: 15px;
  padding: 16px;
  background-color: #ffffff;
} */

.v-card-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: #555555;
  text-align: center;
  margin-bottom: 16px;
}

.v-card-text {
  color: #666666;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  color: #444444;
}

li {
  font-size: 1rem;
  line-height: 1.6;
}

/* Loading Spinner */
.v-progress-circular {
  display: block;
  margin: 20px auto;
}

/* Button Styling */
.v-btn {
  background-color: #ff6f61;
  color: #ffffff;
  border-radius: 30px;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.v-btn:hover {
  background-color: #e65550;
  transform: translateY(-2px);
}

/* Dialog Buttons */
.v-btn.secondary {
  background-color: #4caf50;
}

.v-btn.secondary:hover {
  background-color: #45a045;
}

/* Responsive Design */
@media (max-width: 600px) {
  .title-text {
    font-size: 2rem;
  }

  .v-card {
    margin-bottom: 16px;
  }
}
/* Additional Animations */
.v-card:hover,
.v-btn:hover {
  cursor: pointer;
}

.v-card {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
