<template>
  <v-app>
    <AppLayout>
      <v-main style="min-height: 100vh">
        <v-container
          style="background-color: transparent; backdrop-filter: blur(20px); color: #f6fcdf"
        >
          <v-row class="mb-1 d-flex align-center justify-space-between">
            <!-- Finished Recipes Header -->
            <v-col cols="auto" class="text-center">
              <h2 style="color: #fff">Finished Recipes</h2>
            </v-col>

            <!-- Back to Menu Button -->
            <v-col cols="auto" class="text-end">
              <v-btn
                @click="router.push('/menu')"
                style="background-color: #8d6e63; color: #fff"
                prepend-icon="mdi-arrow-left"
              >
                Back to Menu
              </v-btn>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-row v-if="finishedRecipes.length > 0" class="mt-3">
            <v-col v-for="(recipe, index) in finishedRecipes" :key="index" cols="12" sm="6" md="4">
              <v-card class="menu-card">
                <v-img :src="recipe.image_url" height="200px"></v-img>
                <v-card-title>{{ recipe.title }}</v-card-title>
                <v-card-text>
                  <!-- Display Feedback -->
                  <div v-if="recipe.feedback">
                    <p><strong>Rating:</strong></p>
                    <div class="rating-container">
                      <span
                        v-for="star in recipe.feedback?.rating || 0"
                        :key="star"
                        class="star filled"
                      >
                        ★
                      </span>
                    </div>

                    <p><strong>Comment:</strong> {{ recipe.feedback.comment }}</p>
                  </div>

                  <div v-else>
                    <p>No feedback provided yet.</p>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    style="background-color: #8d6e63; color: #fff"
                    @click="confirmDelete(index)"
                    >Remove</v-btn
                  >
                  <v-btn
                    style="background-color: #8d6e63; color: #fff"
                    @click="openFeedbackDialog(index)"
                  >
                    Feedback
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- Feedback Dialog -->
            <v-dialog v-model="feedbackDialog" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Rate and Provide Feedback</span>
                </v-card-title>
                <v-card-text>
                  <div>
                    <v-rating
                      v-model="currentFeedback.rating"
                      background-color="amber lighten-3"
                      color="amber darken-2"
                      dense
                    ></v-rating>
                  </div>
                  <v-textarea
                    v-model="currentFeedback.comment"
                    label="Your Feedback"
                    auto-grow
                    outlined
                    dense
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click="closeFeedbackDialog">Cancel</v-btn>
                  <v-btn text color="green darken-1" @click="submitFeedback">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <v-row v-else class="no-dishes-container">
            <v-col cols="12" class="d-flex flex-column align-center justify-center text-center">
              <v-card class="no-dishes-card pa-5">
                <v-icon icon="mdi-food-off" size="60" color="grey"></v-icon>
                <h2 class="mt-3" style="color: #e2dfd0">No Finished Recipes</h2>
                <p style="color: #bdbdbd">Start cooking and add recipes here once you finish!</p>
                <v-btn color="brown-lighten-1" class="mt-3" @click="router.push('/menu')">
                  Back to Menu
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </AppLayout>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const route = useRoute()
const finishedRecipes = ref([])
const currentRecipe = ref(null)
const feedbackDialog = ref(false)
const currentFeedback = ref({ recipeId: null, rating: 0, comment: '' })

onMounted(() => {
  fetchFinishedRecipes()
})

// Add this logic to fetch feedback for each recipe
const fetchFinishedRecipes = async () => {
  const { data, error } = await supabase.from('finishdishes').select('*')
  if (error) {
    console.error('Error fetching finished recipes:', error)
  } else {
    finishedRecipes.value = data
    // Fetch feedback for each recipe
    for (const recipe of finishedRecipes.value) {
      await fetchFeedback(recipe.menu_id)
    }
  }
}

// Load all finished recipes
const loadFinishedRecipes = () => {
  finishedRecipes.value = JSON.parse(localStorage.getItem('finishedRecipes')) || []
}

const loadSpecificRecipe = () => {
  const recipeId = route.params.recipeId
  currentRecipe.value = finishedRecipes.value.find((recipe) => recipe.id === recipeId)
}

// Confirm deletion and then remove the recipe
const confirmDelete = (index) => {
  const isConfirmed = confirm('Are you sure you want to remove this Dish?')
  if (isConfirmed) {
    removeFinishedRecipe(index)
  }
}

// Remove recipe from finishedRecipes and Supabase
const removeFinishedRecipe = async (index) => {
  const recipeToRemove = finishedRecipes.value[index]

  try {
    // Start a transaction-like process for deleting both the recipe and its feedback
    const { error: recipeError } = await supabase
      .from('finishdishes')
      .delete()
      .eq('menu_id', recipeToRemove.menu_id)

    if (recipeError) {
      console.error('Error deleting recipe from Supabase:', recipeError)
      alert('Failed to delete the recipe. Please try again.')
      return
    }

    // Delete associated feedback from the feedback table
    const { error: feedbackError } = await supabase
      .from('feedback')
      .delete()
      .eq('menu_id', recipeToRemove.menu_id)

    if (feedbackError) {
      console.error('Error deleting feedback from Supabase:', feedbackError)
      alert('Failed to delete the feedback. Please try again.')
      return
    }

    // Remove the recipe from the local array
    finishedRecipes.value.splice(index, 1)
    localStorage.setItem('finishedRecipes', JSON.stringify(finishedRecipes.value))
    alert('Recipe and associated feedback successfully deleted!')
  } catch (err) {
    console.error('Unexpected error:', err)
    alert('An unexpected error occurred.')
  }
}

const openFeedbackDialog = (index) => {
  const recipe = finishedRecipes.value[index]
  currentFeedback.value = { recipeId: recipe.menu_id, rating: 0, comment: '' }
  feedbackDialog.value = true
}

const closeFeedbackDialog = () => {
  feedbackDialog.value = false
  currentFeedback.value = { recipeId: null, rating: 0, comment: '' }
}

const submitFeedback = async () => {
  try {
    const { error } = await supabase.from('feedback').insert({
      menu_id: currentFeedback.value.recipeId,
      rating: currentFeedback.value.rating,
      comment: currentFeedback.value.comment,
    })

    if (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } else {
      alert('Feedback submitted successfully!')
      // Fetch the updated feedback
      await fetchFeedback(currentFeedback.value.recipeId)
      closeFeedbackDialog()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    alert('An unexpected error occurred.')
  }
}

const fetchFeedback = async (recipeId) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, comment')
      .eq('menu_id', recipeId)

    if (error) {
      console.error('Error fetching feedback:', error)
      return
    }

    if (data && data.length > 0) {
      const feedback = data[0]
      feedback.rating = parseFloat(feedback.rating) || 0 // Ensure rating is a number
      console.log(`Recipe ID: ${recipeId}, Feedback:`, feedback) // Debugging

      const index = finishedRecipes.value.findIndex((r) => r.menu_id === recipeId)
      if (index !== -1) {
        finishedRecipes.value[index] = {
          ...finishedRecipes.value[index],
          feedback,
        }
        console.log(`Updated Recipe:`, finishedRecipes.value[index]) // Debugging
      }
    } else {
      console.warn(`No feedback found for Recipe ID: ${recipeId}`)
    }
  } catch (err) {
    console.error('Unexpected error fetching feedback:', err)
  }
}

// Load finished recipes when component is mounted
onMounted(() => {
  loadFinishedRecipes()
  loadSpecificRecipe()
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

.rating-container {
  display: flex;
  align-items: center;
}

.star {
  font-size: 20px;
  color: #ddd; /* Default unfilled color */
  margin-right: 2px;
}

.star.filled {
  color: #ffc107; /* Filled color */
}

v-rating {
  margin-bottom: 15px;
}

v-textarea {
  margin-bottom: 15px;
}
</style>
