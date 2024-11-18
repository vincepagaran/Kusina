<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const visible = ref(false) // For password visibility
const router = useRouter()

function login() {
  if (email.value && password.value) {
    console.log('Logging in with:', email.value, password.value)
    
    // Redirect to the homepage (or another desired route)
    router.push('/home') // Change to the appropriate route
  } else {
    alert('Please fill out all fields.')
  }
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="d-flex justify-center align-center fill-height">
        <!-- Login Form -->
        <v-row class="d-flex justify-center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <div class="loginform">
              <!-- Logo -->
              <img src="/public/pics/logo.png" alt="Logo" class="login-logo" />
              
              <h1 class="logintitle">Login</h1>
              
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
              
              <!-- Login Button -->
              <v-btn
                class="mb-8 login-btn"
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="login"
              >
                Login
              </v-btn>

              <!-- Register Link -->
              <p class="register">
                Don't have an account? 
                <router-link to="/register" class="signup-link">Sign Up</router-link>
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

.loginform {
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

.login {
  margin-top: 15px;
  font-size: 15px;
}

/* Sign Up Link */
.signup-link {
  color: rgb(69, 100, 228); /* Same color as the login button */
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
  color: #e74c3c; /* Maroon/Dark Red color on hover (same as login button hover) */
}

/* Login Button */
.login-btn {
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #e74c3c; /* Maroon/Dark Red color on hover */
}

</style>
