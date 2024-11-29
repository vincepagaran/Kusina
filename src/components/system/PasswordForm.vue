<script setup>
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

// Form variables
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Loading and status variables
const loading = ref(false)
const updateSuccess = ref(false)
const updateError = ref(false)

// Function to change the password
const changePassword = async () => {
  // Reset status
  updateSuccess.value = false
  updateError.value = false

  // Validate form
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    updateError.value = "New passwords don't match."
    return
  }

  loading.value = true

  try {
    // Supabase requires a session to change the password
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw userError || new Error('User not authenticated.')

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword,
    })

    if (updateError) throw updateError

    // Success
    updateSuccess.value = true
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (err) {
    console.error('Error changing password:', err)
    updateError.value = err.message || 'Failed to change password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="py-5">
    <!-- Form -->
    <v-form>
      <v-row dense class="text-amber-darken-4">
        <v-col cols="12" md="6" style="color: #E2DFD0;">
          <v-text-field
            v-model="passwordForm.currentPassword"
            label="Current Password"
            type="password"
            outlined
            clearable
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6" style="color: #E2DFD0;">
          <v-text-field
            v-model="passwordForm.newPassword"
            label="New Password"
            type="password"
            outlined
            clearable
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6" style="color: #E2DFD0;">
          <v-text-field
            v-model="passwordForm.confirmPassword"
            label="Confirm New Password"
            type="password"
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
      @click="changePassword"
    >
      Change Password
    </v-btn>

    <!-- Status Messages -->
    <v-alert v-if="updateSuccess" type="success" class="mt-3" border="left">
      Password updated successfully!
    </v-alert>
    <v-alert v-if="updateError" type="error" class="mt-3" border="left">
      {{ updateError }}
    </v-alert>
  </v-container>
</template>

<style scoped>
.text-h6 {
  color: #404258;
}
</style>
