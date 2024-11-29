<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { formActionDefault, supabase } from '@/utils/supabase.js'
import { confirmedValidator, passwordValidator, requiredValidator } from '@/utils/validators'
import { ref } from 'vue'

// Load Variables
const formDataDefault = {
  password: '',
  password_confirmation: ''
}
const formData = ref({
  ...formDataDefault
})
const formAction = ref({
  ...formActionDefault
})
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const refVForm = ref()

// Submit Functionality
const onSubmit = async () => {
  /// Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await supabase.auth.updateUser({
    password: formData.value.password
  })

  // Check if has error
  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  }
  // If Successful Add Success Message
  else if (data) {
    formAction.value.formSuccessMessage = 'Successfully Changed Password.'
  }

  // Reset Form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="password-change-form pa-6 rounded-lg elevation-3 mx-auto my-8">
    <v-row class="text-center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="New Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator, passwordValidator]"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          :rules="[requiredValidator, confirmedValidator(formData.password_confirmation, formData.password)]"
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-btn
      type="submit"
      class="change-password-button mt-4 py-3 px-8 text-uppercase font-weight-bold rounded-pill"
      color="sucess"
      prepend-icon="mdi-key"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Change Password
    </v-btn>
  </v-form>
</template>

<style scoped>
.password-change-form {
  max-width: 650px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.change-password-button {
  background-color: #4CAF50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.change-password-button:hover {
  background-color: #43a047;
}
</style>