<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

// Form variables
const userForm = ref({
  firstname: '',
  lastname: '',
  email: '',
})

// Loading and status variables
const router = useRouter()
const loading = ref(false)
const updateSuccess = ref(false)
const updateError = ref(false)

// Fetch user information
const fetchUserDetails = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    const metadata = data.user?.user_metadata || {}
    userForm.value = {
      firstname: metadata.firstname || '',
      lastname: metadata.lastname || '',
      email: data.user?.email || '',
    }
  } catch (err) {
    console.error('Error fetching user details:', err)
  }
}

// Update user information
const updateUserDetails = async () => {
  loading.value = true
  updateSuccess.value = false
  updateError.value = false

  try {
    const { error } = await supabase.auth.updateUser({
      email: userForm.value.email,
      data: {
        firstname: userForm.value.firstname,
        lastname: userForm.value.lastname,
      },
    })

    if (error) throw error
    updateSuccess.value = true
  } catch (err) {
    console.error('Error updating user details:', err)
    updateError.value = true
  } finally {
    loading.value = false
  }
}

router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (to.meta.requiresAuth && !user) {
    next('/')
  } else {
    next()
  }
})

// Fetch user details when the page loads
fetchUserDetails()
</script>

<template>
  <v-form>
    <v-row dense class="text-amber-darken-4">
      <v-col cols="12" md="4" style="color: #E2DFD0;">
        <v-text-field
          v-model="userForm.firstname"
          label="First Name"
          outlined
          clearable
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4" style="color: #E2DFD0;">
        <v-text-field
          v-model="userForm.lastname"
          label="Last Name"
          outlined
          clearable
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4" style="color: #E2DFD0;">
        <v-text-field
          v-model="userForm.email"
          label="Email Address"
          outlined
          clearable
          required
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>

  <!-- Update Button -->
  <v-btn
    color="brown-lighten-1"
    block
    class="mt-2"
    :loading="loading"
    :disabled="loading"
    @click="updateUserDetails"
  >
    Update Account
  </v-btn>

  <!-- Status Messages -->
  <v-alert v-if="updateSuccess" type="success" class="mt-3" border="left">
    Account updated successfully!
  </v-alert>
  <v-alert v-if="updateError" type="error" class="mt-3" border="left">
    Failed to update account. Please try again.
  </v-alert>
</template>

<style scoped>
.text-h6 {
  color: #404258;
}
</style>
