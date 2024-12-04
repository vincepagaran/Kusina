<template>
  <v-app>
    <AppLayout>
      <v-main style="min-height: 100vh">
        <v-container>
          <v-row v-if="finishedRecipes.length > 0">
            <v-col cols="12">
              <h1 style="color: #e2dfd0">Finished Recipes</h1>
            </v-col>
            <v-col v-for="(recipe, index) in finishedRecipes" :key="index" cols="12" sm="6" md="4">
              <v-card class="menu-card">
                <v-img :src="recipe.image_url" height="200px"></v-img>
                <v-card-title>{{ recipe.title }}</v-card-title>
                <v-card-actions>
                  <v-btn style="background-color: #8d6e63; color: #fff;" @click="confirmDelete(index)">Remove</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else class="no-dishes-container">
            <v-col cols="12" class="d-flex flex-column align-center justify-center text-center">
              <v-card class="no-dishes-card pa-5">
                <v-icon icon="mdi-food-off" size="60" color="grey"></v-icon>
                <h2 class="mt-3" style="color: #e2dfd0">No Finished Recipes</h2>
                <p style="color: #bdbdbd">
                  Start cooking and add recipes here once you finish!
                </p>
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
import { supabase } from '@/utils/supabase';

const router = useRouter();
const route = useRoute();
const finishedRecipes = ref([]);
const currentRecipe = ref(null);


const fetchFinishedRecipes = async () => {
  const { data, error } = await supabase.from('finishdishes').select('*')
  if (error) {
    console.error('Error fetching finished recipes:', error)
  } else {
    finishedRecipes.value = data
  }
}

onMounted(() => {
  fetchFinishedRecipes()
})

// Load all finished recipes
const loadFinishedRecipes = () => {
  finishedRecipes.value = JSON.parse(localStorage.getItem('finishedRecipes')) || [];
}

const loadSpecificRecipe = () => {
  const recipeId = route.params.recipeId;
  currentRecipe.value = finishedRecipes.value.find(recipe => recipe.id === recipeId);
}

// Confirm deletion and then remove the recipe
const confirmDelete = (index) => {
  const isConfirmed = confirm("Are you sure you want to remove this Dish?");
  if (isConfirmed) {
    removeFinishedRecipe(index);
  }
}


// Remove recipe from finishedRecipes and Supabase
const removeFinishedRecipe = async (index) => {
  const recipeToRemove = finishedRecipes.value[index];

  try {
    // Delete from Supabase by `menu_id` or any unique identifier
    const { error } = await supabase
      .from('finishdishes')
      .delete()
      .eq('menu_id', recipeToRemove.menu_id); // Ensure you're using the correct field

    if (error) {
      console.error('Error deleting recipe from Supabase:', error);
      alert('Failed to delete the recipe. Please try again.');
    } else {
      // Remove from the local array
      finishedRecipes.value.splice(index, 1);
      localStorage.setItem('finishedRecipes', JSON.stringify(finishedRecipes.value));
      alert('Recipe successfully deleted!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('An unexpected error occurred.');
  }
}


// Load finished recipes when component is mounted
onMounted(() => {
  loadFinishedRecipes();
  loadSpecificRecipe();
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
</style>
