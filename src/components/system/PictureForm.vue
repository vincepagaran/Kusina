<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue';
import { useAuthUserStore } from '@/stores/authUser';
import { formActionDefault } from '@/utils/supabase.js';
import { imageValidator, requiredValidator } from '@/utils/validators';
import { ref, watch } from 'vue';

// Use Pinia Store
const authStore = useAuthUserStore();

// Load Variables
const formDataDefault = {
  image: null,
};
const formData = ref({
  ...formDataDefault,
});
const formAction = ref({
  ...formActionDefault,
});
const refVForm = ref();

// Initialize imgPreview with a default fallback
const imgPreview = ref('/images/img-profile.png');

// Watch for changes in userData when authStore is updated
watch(
  () => authStore.userData,
  (newUserData) => {
    imgPreview.value = newUserData?.image_url || '/images/img-profile.png';
  },
  { immediate: true } // Run immediately after setup
);

// Function to handle file change and show image preview
const onPreview = (event) => {
  const fileReader = new FileReader();
  const { files } = event.target;
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        // Update formData
        formData.value.image = files[0];
        // Update imgPreview state
        imgPreview.value = fileReader.result;
      }
    };
  }
};

// Function to reset preview if file-input clear is clicked
const onPreviewReset = () => {
  imgPreview.value = authStore.userData?.image_url || '/images/img-profile.png';
};

// Submit Functionality
const onSubmit = async () => {
  // Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true };

  const { data, error } = await authStore.updateUserImage(formData.value.image);

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Updated Profile Image.';
  }

  // Turn off processing
  formAction.value.formProcess = false;
};

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit();
  });
};
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" >
    <v-row class="text-amber-darken-4 mt-2">
      <v-col cols="12" md="5" >
        <v-img
          width="55%"
          class="mx-auto rounded-circle"
          color="brown-lighten-1"
          aspect-ratio="1"
          :src="imgPreview"
          alt="Profile Picture Preview"
          cover
        >
        </v-img>
      </v-col>

      <v-col cols="12" md="7" style="color: #E2DFD0;">
        <v-file-input
          class="mt-5"
          :rules="[requiredValidator, imageValidator]"
          accept="image/png, image/jpeg, image/bmp"
          label="Browse Profile Picture"
          placeholder="Browse Profile Picture"
          prepend-icon="mdi-camera"
          show-size
          chips
          @change="onPreview"
          @click:clear="onPreviewReset"
        ></v-file-input>

        <v-btn
          class="mt-2"
          type="submit"
          color="brown-lighten-1"
          prepend-icon="mdi-image-edit"
          :disabled="formAction.formProcess"
          :loading="formAction.formProcess"
        >
          Update Picture
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
