<template>
  <v-app>
    <AppLayout>
      <v-main style="min-height: 100vh">
        <v-container>
          <v-row v-if="menuItems.length > 0">
            <v-col cols="12">
              <h1 style="color: #e2dfd0">Recipe List:</h1>
            </v-col>
            <v-col v-for="(recipe, index) in menuItems" :key="index" cols="12" sm="6" md="4">
              <v-card class="menu-card">
                <v-img :src="recipe.image" height="200px"></v-img>
                <v-card-title>{{ recipe.title }}</v-card-title>
                <v-card-actions>
                  <v-btn color="primary" @click="startCooking(recipe)">Start Cooking</v-btn>
                  <v-btn color="red" @click="removeFromMenu(index)">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else class="no-dishes-container">
            <v-col cols="12" class="d-flex flex-column align-center justify-center text-center">
              <v-card class="no-dishes-card pa-5">
                <v-icon icon="mdi-food-off" size="60" color="grey"></v-icon>
                <h2 class="mt-3" style="color: #e2dfd0">No Dishes Added</h2>
                <p style="color: #bdbdbd">
                  It seems like your menu is empty. Start adding some delicious recipes!
                </p>
                <v-btn color="brown-lighten-1" class="mt-3" @click="router.push('/dishes')">
                  Tap here to add Dishes
                </v-btn>
              </v-card>
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

                <div v-if="currentStep < totalSteps - 1">
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
import router from '@/router'
import AppLayout from '@/components/layout/AppLayout.vue'
import axios from 'axios'

// Menu items state
const menuItems = ref([])

// Retrieve the menu items from localStorage (if any)
const savedMenuItems = JSON.parse(localStorage.getItem('menuItems'))
if (savedMenuItems) {
  menuItems.value = savedMenuItems
}

// State for cooking procedure
const dialog = ref(false)
const currentStep = ref(0)
const recipe = ref(null)

// API URL and key
const API_URL = 'https://api.spoonacular.com/recipes/random'
const API_KEY = '79a38345f6e1445aa4ae814dc7a65ed7'

// Fetch the recipe data from Spoonacular API
const fetchRecipe = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: { apiKey: API_KEY, number: 1 },
    })
    const randomRecipe = response.data.recipes[0]
    recipe.value = {
      title: randomRecipe.title,
      image: randomRecipe.image,
      ingredients: randomRecipe.extendedIngredients.map((i) => i.name),
      steps:
        randomRecipe.analyzedInstructions[0]?.steps.map((s) => ({ description: s.step })) || [],
    }
    currentStep.value = 0
  } catch (error) {
    console.error('Error fetching recipe:', error)
  }
}

const isTimerRunning = ref(false)
const formattedTime = computed(
  () => `${Math.floor(timer.value / 60)}:${timer.value % 60 < 10 ? '0' : ''}${timer.value % 60}`,
)
let timerInterval = null

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

const totalSteps = computed(() => {
  const ingredientSteps = recipe.value?.ingredients?.length || 0;
  const cookingSteps = recipe.value?.steps?.length || 0;
  return ingredientSteps + cookingSteps; // Total number of steps
});

const timer = ref(30)

const startCooking = async () => {
  await fetchRecipe()
  dialog.value = true
  currentStep.value = 0
  isTimerRunning.value = false
  resetTimer()
}

const resetTimer = () => {
  timer.value = 30 // Reset to 30 seconds for the current step
  clearInterval(timerInterval)
  if (isTimerRunning.value) startTimer()
}

const skipStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    resetTimer() // Reset the timer for the new step
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    resetTimer() // Reset the timer for the previous step
  }
}

const toggleTimer = () => {
  if (isTimerRunning.value) {
    clearInterval(timerInterval)
  } else {
    startTimer()
  }
  isTimerRunning.value = !isTimerRunning.value
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval)
      isTimerRunning.value = false
    }
  }, 1000) // Decrease the timer by 1 second
}

const finishCooking = () => {
  // Store the finished recipe in localStorage or another state
  const finishedRecipes = JSON.parse(localStorage.getItem('finishedRecipes')) || [];
  finishedRecipes.push(recipe.value); // Add the current recipe to the finished recipes list
  localStorage.setItem('finishedRecipes', JSON.stringify(finishedRecipes));

  // Close the dialog and reset steps
  dialog.value = false;
  currentStep.value = 0;
  clearInterval(timerInterval);

  // Notify and navigate to FinishRecipe.vue
  alert('Congratulations, you’ve finished cooking! Enjoy your meal.');
  router.push({ name: 'finishrecipe', params: { recipeId: recipe.value.id } });
}

const removeFromMenu = (index) => {
  menuItems.value.splice(index, 1)
  localStorage.setItem('menuItems', JSON.stringify(menuItems.value))
}

watch(currentStep, (newStep) => {
  console.log(`Current Step: ${newStep}, Total Steps: ${totalSteps.value}`);
});

watch(timer, (newValue) => {
  if (newValue <= 0) {
    clearInterval(timerInterval)
    isTimerRunning.value = false
    if (currentStep.value < totalSteps.value - 1) {
      currentStep.value++
      resetTimer()
    }
  }
})
</script>

<style scoped>
.no-dishes-container {
  min-height: 60vh;
}

.no-dishes-card {
  background: #2e2e2e;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

::v-deep(.menu-card) {
  border-radius: 12px;
  background: #a59d84;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.menu-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.menu-card-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
