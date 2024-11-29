<script setup>
import { integerValidator, requiredValidator } from '@/utils/validators'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { ref } from 'vue'

// Utilize pre-defined vue functions
const authStore = useAuthUserStore()

// Load Variables
const formDataDefault = {
  firstname: authStore.userData.firstname,
  lastname: authStore.userData.lastname,
  email: authStore.userData.email
}
const formData = ref({
  ...formDataDefault
})
const formAction = ref({
  ...formActionDefault
})
const refVForm = ref()

// Submit Functionality
const onSubmit = async () => {
  /// Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true }

  const response = await authStore.updateUserInformation(formData.value)

  // Check if successful
  if (response.success) {
    formAction.value.formSuccessMessage = 'Successfully Updated Account.'
  } else {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = response.error.message
    formAction.value.formStatus = response.error.status
  }

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

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="user-update-form pa-6 rounded-lg elevation-3 mx-auto my-8">
    <v-row class="text-center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          :rules="[requiredValidator]"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          :rules="[requiredValidator]"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          readonly
          disabled
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          outlined
          dense
        />
      </v-col>

    </v-row>

          <!-- Simple display button -->
      <v-col cols="12" md="4">
        <v-btn color="green darken-4" outlined>
          Pin Location on Map
        </v-btn>
      </v-col>

    <v-btn
      type="submit"
      class="update-button mt-4 py-3 px-8 text-uppercase font-weight-bold rounded-pill"
      color="sucess"
      prepend-icon="mdi-account-box-edit-outline"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Save Changes
    </v-btn>
  </v-form>
</template>

<style scoped>
.user-update-form {
  max-width: 750px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.update-button {
  background-color: #4CAF50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.update-button:hover {
  background-color: #43a047;
}

.user-update-form {
  max-width: 750px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.update-button {
  background-color: #4CAF50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.update-button:hover {
  background-color: #43a047;
}
</style>