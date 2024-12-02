<script setup>
import { ref } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const visibleConfirm = ref(false)
const refVForm = ref()

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        // is_admin: true
      },
    },
  })
  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formProcess = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered.'
    // add here more actions if you want
    router.replace('/home')
  }

  refVForm.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-alert
    v-if="formAction.formSuccessMessage"
    :text="formAction.formSuccessMessage"
    title="success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>

  <v-alert
    v-if="formAction.formErrorMessage"
    :text="formAction.formErrorMessage"
    title="Error!"
    type="Error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-app>
      <v-main>
        <v-container fluid class="d-flex justify-center align-center fill-height">
          <!-- Registration Form -->
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <div class="registerform">
                <!-- Logo -->
                <img src="/public/pics/logo.png" alt="Logo" class="login-logo" />

                <h1 class="logintitle">Register</h1>

                <!-- fname Input -->
                <v-text-field
                  v-model="formData.firstname"
                  prepend-inner-icon="mdi-account-outline"
                  placeholder="First Name"
                  density="compact"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />

                <!-- Lname Input -->
                <v-text-field
                  v-model="formData.lastname"
                  prepend-inner-icon="mdi-account-outline"
                  placeholder="Last Name"
                  density="compact"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />

                <!-- Email Input -->
                <v-text-field
                  v-model="formData.email"
                  prepend-inner-icon="mdi-email-outline"
                  placeholder="Email"
                  density="compact"
                  variant="outlined"
                  :rules="[requiredValidator, emailValidator]"
                />

                <!-- Password Input with Visibility Toggle -->
                <v-text-field
                  v-model="formData.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  placeholder="Password"
                  density="compact"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                  :rules="[requiredValidator, passwordValidator]"
                />

                <!-- Confirm Password Input with Visibility Toggle -->
                <v-text-field
                  v-model="formData.password_confirmation"
                  :append-inner-icon="visibleConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visibleConfirm ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  placeholder="Confirm Password"
                  density="compact"
                  variant="outlined"
                  @click:append-inner="visibleConfirm = !visibleConfirm"
                  :rules="[
                    requiredValidator,
                    confirmedValidator(formData.password_confirmation, formData.password),
                  ]"
                />

                <!-- Register Button -->
                <v-btn
                  type="submit"
                  class="mb-8 register-btn"
                  color="blue"
                  size="large"
                  variant="tonal"
                  block
                  @click="register"
                  :disabled="formAction.formProcess"
                  :loading="formAction.formProcess"
                >
                  Register
                </v-btn>

                <!-- Login Link -->
                <p class="register">
                  Already have an account?
                  <router-link to="/login" class="login-link">Log In</router-link>
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-form>
</template>

<style scoped>
/* Add styles for the logo */
.login-logo {
  display: block;
  margin: 0 auto 20px;
  width: 100px; /* Adjust size as needed */
  height: auto;
}

/* Your existing styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.v-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/pics/bg3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fill-height {
  min-height: 100vh;
}

.registerform {
  background: rgba(64, 64, 64, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(25px);
  text-align: center;
  color: white;
  width: 100%;
  max-width: 400px; /* Responsive width */
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15);
}

.logintitle {
  font-size: 2rem; /* Adjusted for smaller screens */
  margin-bottom: 20px;
}

.registerinput {
  margin: 15px 0;
  position: relative;
}

.registerinput input {
  width: 100%;
  background: rgba(209, 25, 25, 0.1);
  border: none;
  padding: 12px 12px 12px 45px;
  border-radius: 99px;
  outline: 3px solid transparent;
  transition: 0.3s;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.registerinput input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 500;
}

.registerinput input:focus {
  outline: 3px solid rgba(255, 255, 255, 0.3);
}

.registerinput i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
}

/* Updated Register Button */
.register-btn {
  transition: background-color 0.3s ease; /* Smooth transition */
}

.register-btn:hover {
  background-color: #e74c3c; /* Red color on hover */
}

.register {
  margin-top: 15px;
  font-size: 15px;
}

/* Login Link Color */
.login-link {
  color: rgb(69, 100, 228); /* Set the color to blue */
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
  color: #e74c3c; /* Maroon/Dark Red color on hover */
}
</style>