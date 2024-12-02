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
const recipeGroups = ref([]) // Groups recipes into chunks of 3
const selectedRecipe = ref(null) // Stores detailed recipe information
const loading = ref(false) // Indicates loading state
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
    fetchBreakfastRecipes() // Fetch breakfast recipes on mount
  }
})

// Helper function to group items into chunks
const chunkArray = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Fetch breakfast recipes
const fetchBreakfastRecipes = async () => {
  loading.value = true
  try {
    const response = await axios.get(
      'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert',
    )
    recipes.value = response.data.meals || [] // Assign results or empty array
    recipeGroups.value = chunkArray(recipes.value, 3) // Group recipes into chunks of 3
  } catch (error) {
    console.error('Error fetching breakfast recipes:', error)
  } finally {
    loading.value = false
  }
}

// View recipe details
const viewDetails = async (recipeId) => {
  try {
    loading.value = true;
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/lookup.php', {
      params: { i: recipeId }, // Fetch recipe details by ID
    });

    const recipeDetails = response.data.meals[0];
    selectedRecipe.value = {
      id: recipeDetails.idMeal,
      title: recipeDetails.strMeal,
      image: recipeDetails.strMealThumb,
      summary: recipeDetails.strInstructions,
      ingredients: Object.keys(recipeDetails)
        .filter((key) => key.startsWith('strIngredient') && recipeDetails[key])
        .map((key, index) => {
          const ingredientName = recipeDetails[key];
          return {
            name: ingredientName,
            amount: recipeDetails[`strMeasure${index + 1}`],
            image: `https://www.themealdb.com/images/ingredients/${ingredientName}.png`,
          };
        }),
      instructions: recipeDetails.strInstructions,
    };

    dialog.value = true; // Open the dialog
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  } finally {
    loading.value = false;
  }
};

// Add to Menu
const addToMenu = (recipe) => {
  const savedMenuItems = JSON.parse(localStorage.getItem('menuItems')) || []
  savedMenuItems.push(recipe)
  localStorage.setItem('menuItems', JSON.stringify(savedMenuItems))
  router.push({ name: 'menu' })
}

// Function to close the dialog
const closeDialog = () => {
  selectedRecipe.value = null
  dialog.value = false // Ensure the dialog is properly closed
  loading.value = false // Reset loading state when closing the dialog
}

// Watch and save drawer state
watch(drawer, (newState) => {
  localStorage.setItem('drawerState', JSON.stringify(newState))
})
</script>

<template>
  <AppLayout>
    <v-container>
      <!-- Page Title -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-center" style="color: #e2dfd0">Breakfast Recipes</h1>
        </v-col>
      </v-row>

      <!-- Loading Spinner -->
      <v-row v-if="loading">
        <v-col>
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>

      <!-- Meal Carousel -->
      <v-carousel v-if="!loading && recipes.length > 0" show-arrows-on-hover>
        <v-carousel-item v-for="meal in recipes" :key="meal.idMeal">
          <v-card class="meal-card" outlined>
            <v-img :src="meal.strMealThumb" aspect-ratio="1" alt="Meal Image" />
            <v-card-title class="text-h6">{{ meal.strMeal }}</v-card-title>
            <v-card-actions>
              <v-btn
                style="background-color: #8d6e63; color: #e2dfd0"
                @click="viewDetails(meal.idMeal)"
              >
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-carousel-item>
      </v-carousel>

      <!-- Placeholder for Empty Recipes -->
      <v-row v-if="!loading && recipes.length === 0">
        <v-col>
          <p class="text-center">No breakfast recipes found.</p>
        </v-col>
      </v-row>

      <!-- Meal Details Dialog -->
      <v-dialog v-model="dialog" max-width="600px" centered>
        <v-card>
          <!-- Dialog Title -->
          <v-card-title>
            <h3>{{ selectedRecipe?.title || 'Meal Details' }}</h3>
          </v-card-title>

          <!-- Dialog Content -->
          <v-card-text>
            <v-img :src="selectedRecipe?.image" alt="Meal Image" aspect-ratio="16/9" class="mb-4" />
            <p v-if="selectedRecipe?.summary">
              {{ selectedRecipe.summary }}
            </p>
            <p v-else>Loading meal details...</p>

            <!-- Ingredients List -->
            <ul v-if="selectedRecipe?.ingredients">
              <li v-for="(ingredient, index) in selectedRecipe.ingredients" :key="index">
                {{ ingredient.amount }} - {{ ingredient.name }}
              </li>
            </ul>
          </v-card-text>

          <!-- Dialog Actions -->
          <v-card-actions>
            <v-btn color="green" @click="addToMenu(selectedRecipe)">Add to Menu</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </AppLayout>
</template>


<style scoped>
/* Global Styling */
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
}

/* Title Styling */
.title-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 30px 0;
  color: #333;
  text-align: center;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

/* Meal Cards Styling */
.v-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adds space between the cards */
  justify-content: center;
}

.v-col {
  display: flex;
  justify-content: center;
}

.v-carousel-item {
  display: flex; /* Use flexbox to align children */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100%; /* Ensure the item takes up the full height */
}

.v-carousel__controls {
  height: 40px; /* Reduce the height of the navigation buttons */
  width: 40px; /* Reduce the width of the navigation buttons */
}

.v-carousel__control {
  font-size: 1rem; /* Adjust the font size for icons */
  padding: 5px; /* Reduce the padding inside the buttons */
  background-color: rgba(0, 0, 0, 0.5); /* Set a background color */
  border-radius: 50%; /* Make them circular */
}

.v-carousel__control:hover {
  background-color: rgba(0, 0, 0, 0.7); /* Slightly darker on hover */
  transform: scale(1.1); /* Add a hover effect for better UI */
}

.v-carousel__control-icon {
  font-size: 20px; /* Adjust icon size */
}


.v-card {
  border-radius: 20px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  margin: auto;
  margin-top: 50px;
  max-height: 450px;
  width: 100%; /* Ensures it takes full width of the parent column */
  max-width: 320px; /* Sets the maximum width for the card */
  flex: 1 1 320px; /* Flex with a base width, allowing for responsive scaling */
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.v-img {
  height: 200px; /* Fixed image height */
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 10px 0;
}

.v-card-actions {
  padding: 10px;
  justify-content: center;
  background-color: #f5f5f5;
  left: 50%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.v-btn {
  background-color: #8d6e63;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 30px;
  text-transform: capitalize;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn:hover {
  background-color: #7b5e4a;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.2);
}

.v-btn.secondary {
  background-color: #4caf50;
  color: #ffffff;
}

.v-btn.secondary:hover {
  background-color: #45a045;
}

.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
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
  margin-bottom: 10px;
}

/* Loading Spinner */
.v-progress-circular {
  display: block;
  margin: 20px auto;
}

/* Responsive Design */
@media (max-width: 600px) {
  .v-card {
    margin-top: 16px;
    margin-bottom: 16px;
    max-width: 90%; /* Makes the card width smaller on small screens */
  }

  .v-card-title {
    font-size: 1rem;
  }

  .v-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}

@media (max-width: 400px) {
  .title-text {
    font-size: 2rem;
  }

  .v-card-title {
    font-size: 1rem;
  }

  .v-btn {
    font-size: 0.85rem;
    padding: 6px 12px;
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
