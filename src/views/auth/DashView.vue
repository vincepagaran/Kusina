<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const router = useRouter();
const tab = ref(1);

function navigateTo(route) {
  router.push(route);
  drawer.value = false; // Close the drawer after navigating
}

// Text animation logic for multiple headings
let textIndex1 = 0;
let textIndex2 = 0;
const phrases1 = ["Welcome to Kusina"];
const phrases2 = ["Your go to place Filipino Dishes"];
const animatedText1 = ref("");
const animatedText2 = ref("");

onMounted(() => {
  function typeEffect1() {
    if (textIndex1 < phrases1[0].length) {
      animatedText1.value += phrases1[0].charAt(textIndex1);
      textIndex1++;
      setTimeout(typeEffect1, 150); // Adjust typing speed here
    } else {
      // Delay before starting the second heading
      setTimeout(typeEffect2, 1000);
    }
  }

  function typeEffect2() {
    if (textIndex2 < phrases2[0].length) {
      animatedText2.value += phrases2[0].charAt(textIndex2);
      textIndex2++;
      setTimeout(typeEffect2, 150); // Adjust typing speed here
    }
  }

  typeEffect1(); // Start with the first heading
});
</script>

<template>
  <v-responsive>
    <v-app>
      <v-card>
        <v-toolbar
          height="80"
          style="background-color: #1e1e1e; color: #ffffff"
        >
          <v-toolbar-title class="d-flex align-self-center">
            <v-avatar size="60">
              <!-- Set size of v-avatar here, e.g., 40 pixels -->
              <v-img
                src="/public/pics/logo.png"
                alt="FlavorSync Logo"
                max-width="100%"
                max-height="100%"
              ></v-img>
            </v-avatar>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tabs
            v-model="tab"
            align-tabs="title"
            class="justify-center"
            style="font-family: 'Poppins', sans-serif"
          >
            <v-tab :value="2" @click="navigateTo('/login')">
              <v-icon left>mdi-account</v-icon>Sign up/Log in
            </v-tab>
          </v-tabs>
        </v-toolbar>

        <!-- Main Content Placeholder -->
        <v-main>
          <div class="hero">
            <h1>{{ animatedText1 }}</h1>
            <h2>{{ animatedText2 }}</h2>
            <div class="content"></div>
          </div>

          <router-view></router-view>
        </v-main>
      </v-card>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.hero {
  height: 90vh; /* Full height for the hero section */
  text-align: center;
  padding: 100px 20px;
  background: url('public/pics/gif.gif') no-repeat center center fixed;
  background-size: cover; /* Ensures the GIF covers the full container */
  animation: moveBackground 10s linear infinite; /* Adding animation for movement */
  color: #ffffff; /* White text */
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%; /* Adjust the movement direction */
  }
}

.hero h1 {
  color: #ffffff; /* White color for the main heading */
  font-size: 60px;
  margin: 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Adding a subtle shadow to the heading text */
  animation: fadeIn 2s ease-in-out forwards; /* Fade-in effect for the heading */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero h4 {
  color: #f1f1f1; /* Lighter color for subheadings */
  letter-spacing: 2px;
  font-size: 20px;
  animation: fadeIn 2s ease-in-out forwards; /* Same fade-in effect */
}

.hero span {
  color: #3498db; /* Red highlight color */
}

/* View Dishes button styling */
.view-dishes-btn {
  background: rgba(64, 64, 64, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(25px);
  text-align: center;
  color: white;
  width: 400px;
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15);
}

.view-dishes-btn:hover {
  background-color: #16a085; /* Change button background on hover */
}

.v-footer {
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 20px 0;
}

.v-footer .v-btn {
  margin: 5px;
}

.v-footer .v-icon {
  margin: 0 10px;
  cursor: pointer;
}
</style>
