import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase';

export const useAuthUserStore = defineStore('authUser', () => {
  // States
  const userData = ref(JSON.parse(localStorage.getItem('userData')) || null);

  // Watch `userData` and update localStorage whenever it changes
  watch(userData, (newValue) => {
    if (newValue) {
      localStorage.setItem('userData', JSON.stringify(newValue));
    } else {
      localStorage.removeItem('userData');
    }
  });

  // Getters
  const userRole = computed(() => {
    return userData.value?.is_admin ? 'Administrator' : 'User';
  });

  // Reset State Action
  function $reset() {
    userData.value = null;
  }

  // Actions
  async function getUserInformation() {
    const {
      data: {
        user: { id, email, user_metadata },
      },
    } = await supabase.auth.getUser();

    userData.value = { id, email, ...user_metadata };
  }

  async function updateUserInformation(updatedData) {
    const {
      data: { user: { id, email, user_metadata } },
      error,
    } = await supabase.auth.updateUser({
      data: {
        ...updatedData,
      },
    });

    if (error) {
      return { error };
    } else if (user_metadata) {
      userData.value = { id, email, ...user_metadata };
      return { data: userData.value };
    }
  }

  async function updateUserImage(file) {
    const { data, error } = await supabase.storage
      .from('Kusina')
      .upload('avatars/' + userData.value.id + '-avatar.png', file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { error };
    } else if (data) {
      const { data: imageData } = supabase.storage.from('Kusina').getPublicUrl(data.path);

      return await updateUserInformation({ ...userData.value, image_url: imageData.publicUrl });
    }
  }

  // New: Login Action
  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    } else if (data.user) {
      await getUserInformation(); // Refresh user data after login
      return { data: userData.value };
    }
  }

  return {
    userData,
    userRole,
    $reset,
    getUserInformation,
    updateUserInformation,
    updateUserImage,
    login, // Expose the login function
  };
});
