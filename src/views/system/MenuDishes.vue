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
// import axios from 'axios'

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

// // Replace Spoonacular API with TheMealDB API
// const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php'

// // Fetch the recipe data from TheMealDB API
// const fetchRecipe = async () => {
//   try {
//     const response = await axios.get(API_URL)
//     const randomRecipe = response.data.meals[0]
//     recipe.value = {
//       title: randomRecipe.strMeal,
//       image: randomRecipe.strMealThumb,
//       ingredients: Array.from({ length: 20 })
//         .map((_, i) => randomRecipe[`strIngredient${i + 1}`]?.trim())
//         .filter((ingredient) => ingredient && ingredient !== ''),
//       steps: randomRecipe.strInstructions.split('.').map((step) => ({
//         description: step.trim(),
//       })),
//     }
//     currentStep.value = 0
//   } catch (error) {
//     console.error('Error fetching recipe:', error)
//   }
// }

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

const currentStepDescription = computed(() => {
  if (currentStep.value < recipe.value?.steps?.length) {
    return recipe.value.steps[currentStep.value]?.description
  }
  return ''
})

const totalSteps = computed(() => {
  const ingredientSteps = recipe.value?.ingredients?.length || 0
  const cookingSteps = recipe.value?.steps?.length || 0
  return ingredientSteps + cookingSteps
})

const timer = ref(30)

const startCooking = (selectedRecipe) => {
  recipe.value = selectedRecipe;
  dialog.value = true;
  currentStep.value = 0;
  isTimerRunning.value = false;
  resetTimer();
};


const resetTimer = () => {
  timer.value = 30
  clearInterval(timerInterval)
  if (isTimerRunning.value) startTimer()
}

const skipStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    resetTimer()
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    resetTimer()
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
  }, 1000)
}

const finishCooking = () => {
  const finishedRecipes = JSON.parse(localStorage.getItem('finishedRecipes')) || [];

  // Ensure the recipe has a unique ID
  const finishedRecipe = {
    id: recipe.value.id || `${recipe.value.title}-${Date.now()}`, 
    title: recipe.value.title,
    image: recipe.value.image,
    ingredients: recipe.value.ingredients,
    steps: recipe.value.steps
  };

  // Check if the recipe is already in the list before adding
  if (!finishedRecipes.some((r) => r.id === finishedRecipe.id)) {
    finishedRecipes.push(finishedRecipe);
    localStorage.setItem('finishedRecipes', JSON.stringify(finishedRecipes));
  }

  dialog.value = false;
  clearInterval(timerInterval);

  // Navigate to finish vue with the correct ID
  router.push({ name: 'finishdishes', params: { recipeId: finishedRecipe.id } });
};



const removeFromMenu = (index) => {
  menuItems.value.splice(index, 1)
  localStorage.setItem('menuItems', JSON.stringify(menuItems.value))
}

watch(currentStep, (newStep) => {
  console.log(`Current Step: ${newStep}, Total Steps: ${totalSteps.value}`)
})

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
