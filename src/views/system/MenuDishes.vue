<template>
  <v-app>
    <AppLayout>
      <v-main style="min-height: 100vh">
        <v-container
          style="background-color: transparent; backdrop-filter: blur(20px); color: #f6fcdf"
        >
          <v-row class="mb-3">
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <h2 style="color: #fff">Menu</h2>
              <v-btn
                class="add-menu-btn"
                @click="router.push('/dishes')"
                prepend-icon="mdi-plus"
                style="color: #fff; background-color: #8d6e63"
              >
                Add Dish
              </v-btn>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <!-- Recipe List -->
          <v-row v-if="menuItems.length > 0" class="mt-3">
            <v-col v-for="(recipe, index) in menuItems" :key="recipe.id" cols="12" sm="6" md="4">
              <v-card class="menu-card">
                <v-img :src="recipe.image_url" height="200px"></v-img>
                <v-card-title>
                  {{ recipe.title }}
                  <v-col v-if="isFinished(recipe.id)" color="green" overlap class="finished-badge">
                    Finished
                  </v-col>
                </v-card-title>
                <v-card-actions>
                  <v-btn
                    style="background-color: #8d6e63; color: #e2dfd0"
                    :disabled="isFinished(recipe.id)"
                    @click="startCooking(recipe)"
                  >
                    {{ isFinished(recipe.id) ? 'Finished' : 'Start Cooking' }}
                  </v-btn>
                  <v-btn
                    style="background-color: #8d6e63; color: #fff"
                    :loading="loading"
                    :disabled="loading"
                    @click="confirmDelete(recipe.id, index)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else class="no-dishes-container">
            <v-col cols="12" class="d-flex flex-column align-center justify-center text-center">
              <v-card class="no-dishes-card pa-5">
                <v-icon icon="mdi-food-off" size="60" color="grey"></v-icon>
                <h2 class="mt-3" style="color: #e2dfd0">No Added Dishes</h2>
                <p style="color: #bdbdbd">Start finding Dishes and Start your Cooking Adventure!</p>
                <v-btn color="brown-lighten-1" class="mt-3" @click="router.push('/dishes')">
                  Find Dishes
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <!-- Cooking Procedure Modal -->
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-text>
                <div v-if="currentStep < totalSteps - 1">
                  <!-- Ingredients Section -->
                  <div v-if="currentIngredientHasContent">
                    <!-- Step Number Display Above Ingredients -->
                    <v-row class="d-flex" justify="space-between" align="center">
                      <v-col class="d-flex" cols="auto">
                        <h2 style="color: black; font-weight: bold">Step {{ currentStep + 1 }}</h2>
                      </v-col>
                      <v-col class="d-flex justify-end" cols="auto">
                        <v-btn icon @click="dialog = false">
                          <v-icon color="red">mdi-close</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <h4 style="color: black">Ingredients:</h4>

                    <v-sheet
                      class="ingredient-display"
                      elevation="2"
                      v-if="currentIngredientHasContent"
                    >
                      <v-row align="center">
                        <v-col cols="4" v-if="currentIngredient.image">
                          <v-img
                            :src="currentIngredient.image"
                            alt="Ingredient Image"
                            class="ingredient-image"
                            contain
                          ></v-img>
                        </v-col>
                        <v-col cols="8">
                          <h4 v-if="currentIngredient.name" class="ingredient-name">
                            {{ currentIngredient.name }}
                          </h4>
                          <p v-if="currentIngredient.amount" class="ingredient-amount">
                            {{ currentIngredient.amount }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </div>

                  <!-- Instructions Section -->
                  <h3 v-if="currentStepHasContent && !currentIngredientHasContent">
                    <strong style="color: black; font-weight: bold">Instructions:</strong>
                  </h3>
                  <p>{{ recipe.steps[currentStep] }}</p>

                  <!-- Navigation Buttons -->
                  <br />
                  <v-row class="d-flex" justify="space-between" align="center">
                    <v-btn
                      @click="previousStep"
                      :disabled="currentStep === 0"
                      style="background-color: #8d6e63; color: #fff"
                    >
                      Previous
                    </v-btn>

                    <v-btn @click="skipStep" style="background-color: #8d6e63; color: #fff">
                      Next
                    </v-btn>
                  </v-row>
                </div>

                <!-- Finish Step Section -->
                <div v-else>
                  <h3>Well Done!</h3>
                  <v-btn style="background-color: #8d6e63; color: #fff" @click="finishCooking">
                    Finish
                  </v-btn>
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
import { ref, computed, watch, onMounted } from 'vue'
import router from '@/router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/utils/supabase'

// Menu items state
const menuItems = ref([])
const loading = ref(false)
const finishedDishIds = ref([])

const fetchFinishedDishes = async () => {
  try {
    const { data, error } = await supabase.from('finishdishes').select('menu_id')
    if (error) {
      console.error('Error fetching finished dishes:', error)
    } else {
      finishedDishIds.value = data.map((dish) => dish.menu_id)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Check if the recipe is finished
const isFinished = (id) => finishedDishIds.value.includes(id)

// Fetch finished dishes on mount
onMounted(() => {
  fetchMenuItems()
  fetchFinishedDishes()
})

const confirmDelete = async (id, index) => {
  if (confirm('Are you sure you want to delete this recipe?')) {
    try {
      loading.value = true
      // Delete from Supabase
      const { error } = await supabase.from('menus').delete().eq('id', id)

      if (error) {
        console.error('Error deleting recipe from Supabase:', error)
        alert('Failed to delete the recipe.')
      } else {
        // Remove from local state
        menuItems.value.splice(index, 1)
        alert('Recipe successfully deleted!')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      loading.value = false
    }
  }
}

const fetchMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('id, title, ingredients, instructions, image_url')

    if (error) {
      console.error('Error fetching menu items:', error)
    } else {
      menuItems.value = data
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

onMounted(() => {
  fetchMenuItems()
})

// State for cooking procedure
const dialog = ref(false)
const currentStep = ref(0)
const recipe = ref(null)

const currentIngredient = computed(() => {
  if (currentStep.value < recipe.value?.ingredients?.length) {
    const ingredient = recipe.value.ingredients[currentStep.value]
    return {
      ...ingredient,
      image: ingredient.image || ingredient.ingredients_image,
    }
  }
  return ''
})

const totalSteps = computed(() => {
  const ingredientSteps = recipe.value?.ingredients?.length || 0
  const cookingSteps = recipe.value?.steps?.length || 0
  return ingredientSteps + cookingSteps
})

const currentIngredientHasContent = computed(() => {
  return (
    currentIngredient.value?.name?.trim() ||
    currentIngredient.value?.amount?.trim() ||
    currentIngredient.value?.image
  )
})

const currentStepHasContent = computed(() => {
  return (
    currentIngredientHasContent.value ||
    recipe.value?.steps?.[currentStep.value]?.trim()?.length > 0
  )
})

// Start cooking and prepare instructions
const startCooking = (selectedRecipe) => {
  recipe.value = selectedRecipe
  recipe.value.steps = selectedRecipe.instructions
    .split(/\.(?=\s)|\n/)
    .map((step) => step.trim())
    .filter(Boolean) // Splits by sentence or newline.
  dialog.value = true
  currentStep.value = 0
}

const skipStep = () => {
  // Skip empty steps by finding the next step with content
  while (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    if (currentStepHasContent.value) break
  }
}

// const hasContentForStep = (stepIndex) => {
//   // Check if the step contains ingredients or instructions
//   const step = recipe.value.steps[stepIndex]
//   const ingredient = recipe.value.ingredients[stepIndex]
//   return ingredient?.name || ingredient?.amount || ingredient?.image || step
// }

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Finish cooking process
const finishCooking = async () => {
  const finishedRecipe = {
    menu_id: recipe.value.id,
    title: recipe.value.title,
    image_url: recipe.value.image_url,
  }

  try {
    const { error } = await supabase.from('finishdishes').insert(finishedRecipe)

    if (error) {
      console.error('Error inserting into finishdishes:', error)
      alert('Failed to mark the dish as finished.')
    } else {
      alert('Dish successfully marked as finished!')
      dialog.value = false
      router.push({ name: 'finishdishes', params: { recipeId: finishedRecipe.menu_id } })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

watch(currentStep, (newStep) => {
  console.log(`Current Step: ${newStep}, Total Steps: ${totalSteps.value}`)
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

.ingredient-display {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-name {
  font-size: 1.5rem;
  color: #2e2e2e;
  font-weight: bold;
}

.ingredient-amount {
  font-size: 1.2rem;
  color: #757575;
  margin-top: 4px;
  font-style: italic;
}
.finished-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: transparent !important;
  backdrop-filter: blur(25px);
  color: black;
  text-align: center;
  margin-top: 80px;
}
</style>
