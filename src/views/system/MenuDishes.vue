<template>
  <v-app>
    <AppLayout>
      <v-main style="background-color: #f5f5f5; min-height: 100vh;">
        <v-container>
          <h1 class="text-center mb-8" style="color: #404258;">My Menu</h1>

          <v-row v-if="menuItems.length > 0">
            <v-col v-for="(recipe, index) in menuItems" :key="index" cols="12" sm="6" md="4">
              <v-card>
                <v-img :src="recipe.image" height="200px"></v-img>
                <v-card-title>{{ recipe.title }}</v-card-title>
                <v-card-actions>
                  <v-btn color="primary" @click="startCooking(recipe)">Start Cooking</v-btn>
                  <v-btn color="red" @click="removeFromMenu(index)">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col cols="12" class="text-center">
              <p>No dishes added to the menu yet.</p>
            </v-col>
          </v-row>

          <!-- Cooking Procedure Modal -->
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <h2>{{ currentStep + 1 }} / {{ totalSteps }}</h2>
              </v-card-title>
              <v-card-text>
                <h3>Ingredients</h3>
                <p>{{ currentIngredient }}</p>

                <div v-if="currentStep < totalSteps">
                  <p><strong>Step:</strong> {{ currentStepDescription }}</p>
                  <p><strong>Time Remaining:</strong> {{ formattedTime }}</p>

                  <v-btn @click="previousStep" :disabled="currentStep === 0">Previous</v-btn>
                  <v-btn @click="skipStep" :disabled="isTimerRunning">Skip</v-btn>
                  <v-btn @click="toggleTimer">{{ isTimerRunning ? 'Pause' : 'Start Timer' }}</v-btn>
                </div>

                <div v-else>
                  <p><strong>Cooking complete!</strong></p>
                  <v-btn color="green" @click="finishCooking">Finish</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

        </v-container>
      </v-main>
    </AppLayout>
  </v-app>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import axios from 'axios' // Import axios or your preferred API client

// Menu items state
const menuItems = ref([])

// Retrieve the menu items from localStorage (if any)
const savedMenuItems = JSON.parse(localStorage.getItem('menuItems'))
if (savedMenuItems) {
  menuItems.value = savedMenuItems // Populate the menuItems array
}

// State for cooking procedure
const dialog = ref(false)  // Controls the modal visibility
const currentStep = ref(0)
const recipe = ref(null) // Will hold the dynamic recipe data

// API URL and key
const API_URL = 'https://api.spoonacular.com/recipes/random'
const API_KEY = 'f79e60188f114e95ac5413f96d37d32f'

// Fetch the recipe data from Spoonacular API
const fetchRecipe = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        apiKey: API_KEY, // Pass API key as query parameter
        number: 1 // Get one random recipe
      }
    })
    const randomRecipe = response.data.recipes[0] // Extract the first recipe from the response
    recipe.value = {
      title: randomRecipe.title,
      image: randomRecipe.image,
      ingredients: randomRecipe.extendedIngredients.map(ingredient => ingredient.name),
      steps: randomRecipe.analyzedInstructions[0]?.steps.map(step => ({
        description: step.step
      })) || [] // Use safe navigation for steps in case it's undefined
    }
    currentStep.value = 0 // Reset steps
  } catch (error) {
    console.error('Error fetching recipe:', error)
  }
}

// Ensure steps are initialized when recipe is fetched
const totalSteps = computed(() => (recipe.value?.steps?.length || 0) + (recipe.value?.ingredients?.length || 20))

// Timer state
const timer = ref(300) // Timer in seconds (e.g., 5 minutes)
const isTimerRunning = ref(false) // Timer running status

// Format timer to mm:ss
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
  const seconds = timer.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

// Timer interval handle
let timerInterval = null

// Current ingredient based on step
const currentIngredient = computed(() => {
  if (currentStep.value < recipe.value?.ingredients?.length) {
    return recipe.value.ingredients[currentStep.value]
  }
  return ''
})

// Current step description based on step
const currentStepDescription = computed(() => {
  if (currentStep.value < recipe.value?.steps?.length) {
    return recipe.value.steps[currentStep.value]?.description
  }
  return ''
})

// Start cooking procedure
const startCooking = async () => {
  await fetchRecipe() // Fetch the recipe from Spoonacular
  dialog.value = true // Show the modal dialog
  timer.value = 300 // Reset timer for each recipe (5 minutes)
  isTimerRunning.value = false // Ensure timer is not running on start
  clearInterval(timerInterval) // Clear any existing intervals
}

// Previous step
const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Skip step
const skipStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

// Toggle Timer (Start / Pause)
const toggleTimer = () => {
  if (isTimerRunning.value) {
    clearInterval(timerInterval)
  } else {
    startTimer()
  }
  isTimerRunning.value = !isTimerRunning.value
}

// Start the timer (activated only on "Start Timer" click)
const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value-- // Decrement time
    } else {
      clearInterval(timerInterval) // Stop timer when it reaches 0
    }
  }, 1000) // Update every second
}

// Finish cooking
const finishCooking = () => {
  dialog.value = false // Close the modal
  currentStep.value = 0
  clearInterval(timerInterval) // Stop the timer
  alert('Congratulations, you finished cooking!')
}

// Remove a dish from the menu
const removeFromMenu = (index) => {
  menuItems.value.splice(index, 1)
  localStorage.setItem('menuItems', JSON.stringify(menuItems.value))
}

// Watch the timer to stop at 0
watch(timer, (newValue) => {
  if (newValue <= 0) {
    clearInterval(timerInterval) // Stop the timer if it reaches 0
  }
})

</script>



<style scoped>
/* Menu Title */
h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #404258;
}

/* Card Styling */
.menu-card {
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.menu-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.menu-card-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Button Styling */
v-btn {
  margin-right: 8px;
}

/* Dialog Content */
ul {
  list-style: disc;
  margin-left: 16px;
}

li {
  font-size: 1rem;
}
</style>
