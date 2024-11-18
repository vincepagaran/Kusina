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
      <router-link to="/" class="router-link-btn">
        <v-btn text>Logout</v-btn>
      </router-link>
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

<script>
export default {
  data() {
    return {
      categories: [
        { title: "Main Courses", img: "public/pics/main.jpg" },
        { title: "Desserts", img: "public/pics/dessert.jpg" },
        { title: "Healthy Eats", img: "public/pics/healthy.jpg" },
        { title: "Snacks", img: "public/pics/snacks.jpg" }
      ]
    };
  },
  methods: {
    viewCategory(category) {
      this.$router.push({ name: 'category', params: { categoryName: category } });
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}

.v-btn {
  margin-left: 10px;
}

.v-main {
  background-image: url("public/pics/bg1.jpg");
  background-size: cover;
  background-position: center;
}

/* Space below the title */
.title-text {
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: bold;
  color: white; /* White text color for title */
}

/* Category Cards */
.category-card {
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* Category Image Styling */
.category-image {
  object-fit: cover; /* Cover the whole card */
  height: 200px; /* Ensure the image covers the card's height */
  width: 100%; /* Make sure the image fills the card's width */
}

/* Adjust spacing between categories */
.v-row {
  margin-top: 20px;
}

/* Styling the router-links for buttons */
.router-link-btn {
  text-decoration: none; /* Remove underline from router-link */
}
</style>
