<script setup>
import { supabase, formActionDefault } from '@/utils/supabase'
import { getAvatarText } from '@/utils/helpers'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthUserStore } from '@/stores/authUser'

// Utilize pre-defined vue functions
const router = useRouter()

// Use Pinia Store
const authStore = useAuthUserStore()

// Load Variables
const formAction = ref({
  ...formActionDefault,
})

// User data object to display information
const userData = ref({
  initials: ' ',
  email: ' ',
  fullname: ' ',
})

// Function to get user information
const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    const metadata = data.user?.user_metadata || {}

    userData.value.email = data.user?.email || 'No email provided'
    userData.value.fullname =
      (metadata.firstname || 'User') + ' ' + (metadata.lastname || '')
    userData.value.initials = getAvatarText(userData.value.fullname)
  } catch (err) {
    console.error('Error fetching user:', err)
    userData.value = {
      initials: 'G',
      email: 'No email provided',
      fullname: 'Guest',
    }
  }
}

// Logout Functionality
const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    formAction.value.formProcess = false
    setTimeout(() => {
      authStore.$reset()
    }, 2500)
    router.replace('/')
  } catch (err) {
    console.error('Error during logout:', err)
    formAction.value.formProcess = false
  }
}

// Fetch user information when the component mounts
onMounted(() => {
  getUser()
})
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          v-if="authStore.userData?.image_url"
          :image="authStore.userData.image_url"
          color="grey-darken-3"
          size="large"
        ></v-avatar>
        <v-avatar v-else color="grey-darken-3" size="large">
          <span class="text-h5">{{ userData.initials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1" style="background-color: transparent; backdrop-filter: blur(25px); color: #e2dfd0">
      <v-card-text >
        <v-list style="background-color: transparent; backdrop-filter: blur(25px); color: #e2dfd0">
          <v-list-item :title="userData.fullname" :subtitle="userData.email" >
            <template #prepend>
              <v-avatar v-if="authStore.userData?.image_url" :image="authStore.userData.image_url" color="grey-darken-3" size="large"></v-avatar>
              <v-avatar v-else color="grey-darken-3" size="large">
                <span class="text-h5">{{ userData.initials }}</span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>

        <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
          Account Settings
        </v-btn>

        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>