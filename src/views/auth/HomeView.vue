<script>
export default {
  data() {
    return {
      categories: [
        { title: "Main Courses", img: "/pics/main.jpg" },
        { title: "Desserts", img: "/pics/dessert.jpg" },
        { title: "Healthy Eats", img: "/pics/healthy.jpg" },
        { title: "Snacks", img: "/pics/snacks.jpg" }
      ]
    };
  },
  methods: {
    viewCategory(category) {
      this.$router.push({ name: 'category', params: { categoryName: category } });
    },
    logout() {
      // Add your logout logic here (e.g., call the Supabase or authentication logout function)
      console.log('Logging out...');
      
      // Redirect to the dash page after logout
      this.$router.push('/');
    }
  }
};
</script>
<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app>
      <v-toolbar-title>
        <v-img src="/pics/logo.png" alt="Logo" width="50" class="mr-3"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Router links wrapped around v-btn for Sign Up and Logout -->
      <router-link to="/" class="router-link-btn">
        <v-btn text>Dishes</v-btn>
      </router-link>
      <router-link to="/dash" class="router-link-btn">
        <v-btn text>Cooklater</v-btn>
      </router-link>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1 class="text-center title-text">What do you want to make?</h1>
        <v-row class="mt-4">
          <!-- Category Images -->
          <v-col v-for="(category, index) in categories" :key="index" cols="12" sm="3">
            <v-card class="category-card">
              <v-img :src="category.img" alt="Category Image" class="category-image"></v-img>
              <v-card-title class="text-center">{{ category.title }}</v-card-title>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="viewCategory(category.title)">View</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
