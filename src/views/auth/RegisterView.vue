<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const visible = ref(false) // For password visibility
const visibleConfirm = ref(false) // For confirm password visibility
const router = useRouter()

function register() {
  if (email.value && password.value && confirmPassword.value) {
    if (password.value === confirmPassword.value) {
      console.log('Registering with:', email.value, password.value)
      
      // Simulate registration success and redirect to the login page
      router.push('/login') // Redirect to login after successful registration
    } else {
      alert('Passwords do not match.')
    }
  } else {
    alert('Please fill out all fields.')
  }
}
</script>

<template>
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
              
              <!-- Email Input -->
              <v-text-field
                v-model="email"
                prepend-inner-icon="mdi-email-outline"
                placeholder="Email"
                density="compact"
                variant="outlined"
              />

              <!-- Password Input with Visibility Toggle -->
              <v-text-field
                v-model="password"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                placeholder="Password"
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />

              <!-- Confirm Password Input with Visibility Toggle -->
              <v-text-field
                v-model="confirmPassword"
                :append-inner-icon="visibleConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visibleConfirm ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                placeholder="Confirm Password"
                density="compact"
                variant="outlined"
                @click:append-inner="visibleConfirm = !visibleConfirm"
              />
              
              <!-- Register Button -->
              <v-btn
                class="mb-8 register-btn"
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="register"
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
