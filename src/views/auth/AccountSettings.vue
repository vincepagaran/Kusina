<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import PictureForm from '@/components/system/PictureForm.vue'
import ProfileForm from '@/components/system/ProfileForm.vue'
import PasswordForm from '@/components/system/PasswordForm.vue'
import { useAuthUserStore } from '@/stores/authUser'
import { ref } from 'vue'

// Utilize pre-defined vue functions
const authStore = useAuthUserStore()

// Load Variables
const isDrawerVisible = ref(true)

</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <template #content>
      <v-container>
        <v-card class="mb-5 fade-in">
          <template #title>
            <span class="text-h6 font-weight-bold ">
              <v-breadcrumbs :items="['Account', 'Settings']" color="green-darken-3"></v-breadcrumbs>
            </span>
          </template>
        </v-card>

        <v-row>
          <v-col cols="12" lg="4">
            <v-card class="border-green">
              <v-card-text>
                <v-img
                  width="50%"
                  class="mx-auto rounded-circle"
                  color="green-darken-1"
                  aspect-ratio="1"
                  :src="authStore.userData.image_url || '/images/img-profile.png'"
                  alt="Profile Picture"
                  cover
                >
                </v-img>

                <h3 class="d-flex align-center justify-center mt-5">
                  <v-icon class="me-2" color="green-darken-4" icon="mdi-account-badge"> </v-icon>
                  {{ authStore.userRole }}
                </h3>

                <v-divider class="my-5 fade-in-divider"></v-divider>

                <div class="text-center fade-in-text">
                  <h4 class="my-2">
                    <b class="text-green-darken-4">Fullname:</b>
                    {{ authStore.userData?.firstname + ' ' + authStore.userData?.lastname }}
                  </h4>
                  <h4 class="my-2"><b class="text-green-darken-4">Email:</b> {{ authStore.userData?.email }}</h4>
                  <h4 class="my-2"><b class="text-green-darken-4">Contact No.:</b> {{ authStore.userData?.phone }}</h4>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="8">
            <v-card class="mb-5 border-green fade-in" style="animation-delay: 0.4s;">
              <v-card-title>
                <v-icon class="mr-2" color="green darken-4">mdi-account-circle</v-icon> <!-- Icon for Profile Picture -->
                Profile Picture
              </v-card-title>
              <v-card-text>
                <PictureForm></PictureForm>
              </v-card-text>
            </v-card>

            <v-card class="mb-5 border-green fade-in" style="animation-delay: 0.6s;">
              <v-card-title>
                <v-icon class="mr-2" color="green darken-4">mdi-information</v-icon> <!-- Icon for Profile Information -->
                Profile Information
              </v-card-title>
              <v-card-text>
                <ProfileForm></ProfileForm>
              </v-card-text>
            </v-card>

            <v-card class="mb-5 border-green fade-in" style="animation-delay: 0.8s;">
              <v-card-title>
                <v-icon class="mr-2" color="green darken-4">mdi-lock</v-icon> <!-- Icon for Change Password -->
                Change Password
              </v-card-title>
              <v-card-text>
                <PasswordForm></PasswordForm>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Border Styling */
.border-green {
  border: 2px solid #4B8B3B;
}

/* General Fade-in Animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

/* Profile Picture Hover Effect */
.profile-picture {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-picture:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

/* Fade-in Delay for Text and Divider */
.fade-in-text {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: 0.4s;
}

.fade-in-divider {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: 0.5s;
}

/* Card Hover Effect */
.v-card:hover {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>