<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter() // Use Vue Router

function home() {
  if (email.value && password.value) {
    console.log('Logging in with:', email.value, password.value, rememberMe.value)
    
    // Simulate successful login and redirect to the home page
    router.push('/home')
  } else {
    alert('Please fill out both email and password fields.')
  }
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="d-flex justify-center align-center fill-height">
        <!-- Login Form -->
        <div class="loginform">
          <!-- Logo -->
          <img src="/public/pics/logo.png" alt="Logo" class="login-logo" />
          
          <h1 class="logintitle">Login</h1>
          <div class="logininput">
            <i class="fa-solid fa-user"></i>
            <input type="Email" v-model="email" placeholder="Email" />
          </div>
          <div class="logininput">
            <i class="fa-solid fa-lock"></i>
            <input type="password" v-model="password" placeholder="Password" />
          </div>
          <div class="rememberbox">
            <label for="remember">
              <input type="checkbox" v-model="rememberMe" />
              Remember me
            </label>
          </div>
          <button @click="home" id="Loginbtn" class="loginbtn">Login</button>
          <p class="register">
            Don't have an account?
            <router-link to="/register">Sign Up</router-link>
          </p>
        </div>
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
  background-image: url('/public/pics/bg2.jpg'); 
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
  width: 400px;
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15);
}

.logintitle {
  font-size: 40px;
  margin-bottom: 40px;
}

.logininput {
  margin: 20px 0;
  position: relative;
}

.logininput input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 12px 12px 12px 45px;
  border-radius: 99px;
  outline: 3px solid transparent;
  transition: 0.3s;
  font-size: 17px;
  color: white;
  font-weight: 600;
}

.logininput input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-size: 17px;
  font-weight: 500;
}

.logininput input:focus {
  outline: 3px solid rgba(255, 255, 255, 0.3);
}

.logininput i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.rememberbox {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 15px;
}

.rememberbox label {
  display: flex;
  gap: 8px;
  cursor: pointer;
}

.rememberbox input {
  accent-color: white;
  cursor: pointer;
}

.rememberbox a {
  color: white;
  text-decoration: none;
}

.rememberbox a:hover {
  text-decoration: underline;
}

.loginbtn {
  width: 100%;
  padding: 10px 0;
  background: #213032;
  border: none;
  border-radius: 99px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.loginbtn:hover {
  background: #e74c3c;
}

.register {
  margin-top: 15px;
  font-size: 15px;
}

.register a {
  color: #213032;
  text-decoration: none;
  font-weight: 500;
}

.register a:hover {
  text-decoration: underline;
  color: #e74c3c;
}
</style>

