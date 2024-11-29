<script setup>
import AppLayout from '../layout/AppLayout.vue';
import PasswordForm from './PasswordForm.vue';
import ProfileForm from './ProfileForm.vue';
import PictureForm from './PictureForm.vue';
import { onMounted } from 'vue';
import { useAuthUserStore } from '@/stores/authUser';

// Use Pinia Store
const authStore = useAuthUserStore();

onMounted(async () => {
  await authStore.getUserInformation();
});
</script>

<template>
  <AppLayout>
    <v-container class="py-5">
      <!-- Breadcrumbs -->
      <v-card class="mb-5">
        <v-card-title>
          <span class="text-h6 font-weight-bold">
            <v-breadcrumbs :items="['Account', 'Settings']">
              <template #prepend>
                <v-icon icon="mdi-wrench" size="small" class="me-1"></v-icon>
              </template>
            </v-breadcrumbs>
          </span>
        </v-card-title>
        <v-card-subtitle>
          <p class="ms-4 text-wrap">
            Edit profile information, update profile picture, and change password.
          </p>
        </v-card-subtitle>
      </v-card>

      <v-row justify="center">
        <!-- User Info Card -->
        <v-col cols="12" lg="4">
          <v-card>
            <v-card-text>
              <v-img
                width="50%"
                class="mx-auto rounded-circle"
                color="brown-lighten-1"
                aspect-ratio="1"
                :src="authStore.userData?.image_url || '/images/img-profile.png'"
                alt="Profile Picture"
                cover
              ></v-img>

              <h3 class="d-flex align-center justify-center mt-5">
                <v-icon class="me-2" icon="mdi-account-badge"> </v-icon>
                {{ authStore.userRole || 'User' }}
              </h3>

              <v-divider class="my-5"></v-divider>

              <div class="text-center">
                <h4 class="my-2">
                  <b>Fullname:</b>
                  {{ authStore.userData?.firstname}} {{ authStore.userData?.lastname}}
                </h4>
                <h4 class="my-2">
                  <b>Email:</b> {{ authStore.userData?.email}}
                </h4>

              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Forms Section -->
        <v-col cols="12" lg="8">
          <v-card class="mb-5">
            <v-card-title>Profile Picture</v-card-title>
            <v-card-text>
              <PictureForm />
            </v-card-text>
          </v-card>

          <v-card class="mb-5">
            <v-card-title>Profile Information</v-card-title>
            <v-card-text>
              <ProfileForm />
            </v-card-text>
          </v-card>

          <v-card class="mb-5">
            <v-card-title>Change Password</v-card-title>
            <v-card-text>
              <PasswordForm />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </AppLayout>
</template>

<style scoped>
.text-h6 {
  color: #404258;
}
</style>
