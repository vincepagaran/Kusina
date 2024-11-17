<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const email = ref('')
const firstName = ref('')
const lastName = ref('')
const contactNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

// Simulated existing users (for demo purposes)
const existingUsers = ['test@example.com', 'user@example.com']

function navigateTo(route) {
  router.push(route)
}

function register() {
  // Check if the email already exists
  if (existingUsers.includes(email.value)) {
    alert('This email is already registered. Please use a different email.')
    return
  }

  if (
    email.value &&
    firstName.value &&
    lastName.value &&
    contactNumber.value &&
    password.value &&
    confirmPassword.value
  ) {
    if (password.value === confirmPassword.value) {
      console.log(
        'Registering with:',
        email.value,
        firstName.value,
        lastName.value,
        contactNumber.value,
        password.value,
      )

      // Here you would normally send the registration data to your server.
      // For demo purposes, we're just pushing the email to existingUsers array.
      existingUsers.push(email.value)

      // Redirect to login after successful registration
      router.push('/')
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
        <v-btn
          @click="navigateTo('/login')"
          class="back-home-btn"
          outlined
          color="white"
        >
          <v-icon left>mdi-arrow-left</v-icon>
        </v-btn>
        <!-- Sign-up Form -->
        <div class="signupform">
          <v-avatar size="100">
            <!-- Set size of v-avatar here, e.g., 40 pixels -->
            <v-img src="/public/pics/logo.png" alt="Kusina"></v-img>
          </v-avatar>
          <h2 class="signuptitle">Sign Up</h2>
          <div class="signinput">
            <i class="fa-solid fa-user"></i>
            <input type="text" v-model="firstName" placeholder="First Name" />
          </div>
          <div class="signinput">
            <i class="fa-solid fa-user"></i>
            <input type="text" v-model="lastName" placeholder="Last Name" />
          </div>
          <div class="signinput">
            <i class="fa-solid fa-phone"></i>
            <input
              type="number"
              v-model="contactNumber"
              placeholder="Contact Number"
            />
          </div>
          <div class="signinput">
            <i class="fa-solid fa-user"></i>
            <input type="Email" v-model="email" placeholder="Email" />
          </div>
          <div class="signinput">
            <i class="fa-solid fa-lock"></i>
            <input type="password" v-model="password" placeholder="Password" />
          </div>
          <div class="signinput">
            <i class="fa-solid fa-lock"></i>
            <input
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>

          <button @click="register" id="Registerbtn" class="signinbtn">
            Confirm
          </button>
          <p class="register">
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Your existing styles remain unchanged */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.back-home-btn {
  border-radius: 50%; /* Make the button round */
  width: 40px; /* Set the width */
  height: 60px; /* Set the height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; /* Remove padding for a compact look */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2); /* Optional shadow */
}

.back-home-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
}

.v-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #a3b8c8, #2c3e50);
  color: #ffffff; 
   background-image: url('/public/pics/bg2.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fill-height {
  min-height: 100vh;
}

.signupform {
  background: rgba(64, 64, 64, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(25px);
  text-align: center;
  color: white;
  width: 90%; /* Full width on mobile */
  max-width: 400px; /* Limit max width */
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15);
}

.signuptitle {
  font-size: 40px;
  margin-bottom: 40px;
}

.signinput {
  margin: 20px 0;
  position: relative;
}

.signinput input {
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

.signinput input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-size: 17px;
  font-weight: 500;
}

.signinput input:focus {
  outline: 3px solid rgba(255, 255, 255, 0.3);
}

.signinput i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
}

/* Hide the spinner on number input */
.signinput input[type='number']::-webkit-inner-spin-button,
.signinput input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.signinbtn {
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

.signinbtn:hover {
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

/* Responsive Design */
@media (max-width: 600px) {
  .signuptitle {
    font-size: 30px; /* Adjust title size for smaller screens */
  }

  .signupform {
    padding: 20px; /* Reduce padding for smaller screens */
  }

  .signinput input {
    font-size: 15px; /* Adjust input font size */
  }

  .signinbtn {
    font-size: 14px; /* Adjust button font size */
  }

  .register {
    font-size: 14px; /* Adjust register text size */
  }
}
</style>