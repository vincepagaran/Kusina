<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import axios from 'axios'

const router = useRouter()
const dialog = ref(false)
const selectedRecipe = ref(null)
const user = ref(null)
const loading = ref(false)
const meals = ref([]) // Store meals data
const isDialogOpen = ref(false) // Dialog visibility
const selectedMeal = ref(null) // Selected meal details

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

// Fetch breakfast meals
const fetchBreakfastMeals = async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast')
    const data = await response.json()
    meals.value = data.meals
  } catch (error) {
    console.error('Error fetching breakfast meals:', error)
  }
}

const viewDetails = async (recipeId) => {
  try {
    loading.value = true
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/lookup.php', {
      params: { i: recipeId }, // Fetch recipe details by ID
    })

    const recipeDetails = response.data.meals[0]
    selectedRecipe.value = {
      id: recipeDetails.idMeal,
      title: recipeDetails.strMeal,
      image: recipeDetails.strMealThumb,
      summary: recipeDetails.strInstructions,
      ingredients: Object.keys(recipeDetails)
        .filter((key) => key.startsWith('strIngredient') && recipeDetails[key])
        .map((key, index) => ({
          name: recipeDetails[key],
          amount: recipeDetails[`strMeasure${index + 1}`],
        })),
      instructions: recipeDetails.strInstructions,
    }

    dialog.value = true // Open the dialog
  } catch (error) {
    console.error('Error fetching recipe details:', error)
  } finally {
    loading.value = false
  }
}

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
}

onMounted(fetchBreakfastMeals)
</script>

<template>
  <v-container>
    <!-- Page Title -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Breakfast Recipes</h1>
      </v-col>
    </v-row>

    <!-- Meal Cards -->
    <v-row>
      <v-col
        v-for="meal in meals"
        :key="meal.idMeal"
        cols="12"
        sm="6"
        md="4"
        class="d-flex align-center justify-center"
      >
        <v-card class="meal-card" outlined @click="viewDetails(meal.idMeal)">
          <v-img :src="meal.strMealThumb" aspect-ratio="1" alt="Meal Image" />
          <v-card-title class="text-h6">{{ meal.strMeal }}</v-card-title>
          <v-card-actions>
            <v-btn
              style="background-color: #8d6e63; color: #e2dfd0"
              @click.stop="viewDetails(meal.idMeal)"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Meal Details Dialog -->
    <v-dialog v-model="isDialogOpen" max-width="600px">
      <v-card>
        <!-- Dialog Title -->
        <v-card-title>
          <h3>{{ selectedMeal?.title || 'Meal Details' }}</h3>
        </v-card-title>

        <!-- Dialog Content -->
        <v-card-text>
          <v-img :src="selectedMeal?.image" alt="Meal Image" aspect-ratio="16/9" class="mb-4" />
          <p v-if="selectedMeal?.summary">
            {{ selectedMeal.summary }}
          </p>
          <p v-else>Loading meal details...</p>

          <!-- Ingredients List -->
          <ul v-if="selectedMeal?.ingredients">
            <li v-for="(ingredient, index) in selectedMeal.ingredients" :key="index">
              {{ ingredient.amount }} - {{ ingredient.name }}
            </li>
          </ul>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions>
          <v-btn color="green" @click="addToMenu(selectedMeal)">Add to Menu</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.meal-card {
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: #f5f5f5;
}

.meal-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.text-center {
  text-align: center;
  margin: 16px 0;
}

.text-h6 {
  font-size: 1.25rem;
  text-align: center;
}
</style>
