<template>
  <v-app>
    <AppLayout>
      <v-main style="background-color: #f5f5f5; min-height: 100vh;">
        <v-container>
          <h1 class="text-center mb-8" style="color: #404258;">My Menu</h1>

          <!-- Check if there are any menu items -->
          <v-row v-if="menuItems.length > 0">
            <v-col v-for="(recipe, index) in menuItems" :key="index" cols="12" sm="6" md="4">
              <v-card>
                <v-img :src="recipe.image" height="200px"></v-img>
                <v-card-title>{{ recipe.title }}</v-card-title>
                <v-card-actions>
                  <!-- Start Cooking button -->
                  <v-btn color="primary" @click="startCooking(recipe)">Start Cooking</v-btn>
                  <!-- Delete button -->
                  <v-btn color="red" @click="removeFromMenu(index)">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <!-- Display message if no menu items -->
          <v-row v-else>
            <v-col cols="12" class="text-center">
              <p>No dishes added to the menu yet.</p>
            </v-col>
          </v-row>

          <!-- Cooking Procedure Modal (Appears when Start Cooking is clicked) -->
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <h2>{{ currentStep + 1 }} / {{ totalSteps }}</h2>
              </v-card-title>
              <v-card-text>
                <h3>Ingredients</h3>
                <ul>
                  <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
                </ul>

                <div v-if="currentStep < totalSteps">
                  <p><strong>Step:</strong> {{ recipe.steps[currentStep].description }}</p>
                  <v-btn @click="previousStep" :disabled="currentStep === 0">Previous</v-btn>
                  <v-btn @click="skipStep">Skip</v-btn>
                  <v-btn @click="nextStep">Next</v-btn>
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
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// Menu items state
const menuItems = ref([])

// Retrieve the menu items from localStorage (if any)
const savedMenuItems = JSON.parse(localStorage.getItem('menuItems'))

if (savedMenuItems) {
  menuItems.value = savedMenuItems  // Populate the menuItems array
}

// State for cooking procedure
const dialog = ref(false)  // Controls the modal visibility
const currentStep = ref(0)
const recipe = ref({
  title: 'Spaghetti Bolognese',
  image: 'https://via.placeholder.com/150',
  ingredients: ['Spaghetti', 'Tomato Sauce', 'Ground Beef', 'Onions', 'Garlic'],
  steps: [
    { description: 'Boil the spaghetti in salted water.' },
    { description: 'Prepare the sauce by frying onions and garlic, then add ground beef.' },
    { description: 'Simmer the sauce and combine with spaghetti.' },
  ],
})

const totalSteps = computed(() => recipe.value.steps.length)

// Start cooking procedure
const startCooking = (selectedRecipe) => {
  recipe.value = selectedRecipe
  dialog.value = true // Show the modal dialog
  currentStep.value = 0
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

// Next step
const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

// Finish cooking
const finishCooking = () => {
  dialog.value = false // Close the modal
  currentStep.value = 0
  alert('Congratulations, you finished cooking!')
}

// Remove a dish from the menu
const removeFromMenu = (index) => {
  menuItems.value.splice(index, 1)
  localStorage.setItem('menuItems', JSON.stringify(menuItems.value))
}
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
