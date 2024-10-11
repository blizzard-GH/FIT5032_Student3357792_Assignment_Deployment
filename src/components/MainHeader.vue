<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const store = useStore()
const router = useRouter()
const auth = getAuth()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const isAdmin = computed(() => store.getters.getUserData.role === 'administrator')

const logouterror = ref(null)
const logoutsuccess = ref(false)
const firebaseUser = auth.currentUser

const fontSize = ref(100)

const increaseFontSize = () => {
  fontSize.value += 10
}

const decreaseFontSize = () => {
  fontSize.value = Math.max(fontSize.value - 10, 100)
}

watch(fontSize, (newSize) => {
  document.documentElement.style.fontSize = `${newSize}%`
})

const handleLogout = async () => {
  try {
    if (firebaseUser) {
      // Option 2: using await
      await signOut(auth)
      await store.dispatch('logout')
      logoutsuccess.value = true
      setTimeout(() => {
        logoutsuccess.value = false
        router.push({ name: 'LoginPage' })
      }, 700)
    } else {
      await store.dispatch('logout')
      logoutsuccess.value = true
      setTimeout(() => {
        logoutsuccess.value = false
        router.push({ name: 'LoginPage' })
      }, 700)
    }
  } catch (error) {
    logouterror.value = 'Failed to log out: ' + error.message
  }
}

// Method to navigate to the login page
const goToLogin = () => {
  router.push({ name: 'LoginPage' })
}

// Method to navigate to the registration page
const gotoRegistrationPage = () => {
  router.push({ name: 'UserRegistrationPage' })
}

// Method to navigate to the user profile page
const gotoProfilePage = () => {
  router.push({ name: 'UserProfilePage' })
}

// Method to navigate to rating page
const gotoRatingPage = () => {
  router.push({ name: 'RatingPage' })
}

// Method to navigate to bulk email sending page
const gotoAdminDashboard = () => {
  router.push({ name: 'AdminDashboard' })
}

// Method to navigate to bulk email sending page
const gotoBulkEmail = () => {
  router.push({ name: 'BulkEmail' })
}
</script>

<template>
  <header>
    <div class="px-3 py-2 bg-light text-white">
      <div class="container">
        <div
          class="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start text-center text-md-left"
        >
          <ul class="nav nav-pills justify-content-center w-100">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active" aria-current="page"
                >Information</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/newsFeed" class="nav-link" active-class="active"
                >News Feed</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/upcomingEvents" class="nav-link" active-class="active"
                >Upcoming Events</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" active-class="active">About Us</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contactUs" class="nav-link" active-class="active"
                >Contact Us</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/donation" class="nav-link" active-class="active"
                >Donation</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/weatherInformation" class="nav-link" active-class="active"
                >Check Weather</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/mapInformation" class="nav-link" active-class="active"
                >Check Map</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/genAI" class="nav-link" active-class="active"
                >AI Assistant</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="px-3 py-2 border-bottom mb-3">
      <div class="container d-flex flex-wrap justify-content-center">
        <div class="font-size-controls d-flex align-items-center">
          <div class="font-size-pos-controls">
            <button @click="decreaseFontSize">A-</button>
          </div>
          <div class="font-size-neg-controls">
            <button @click="increaseFontSize">A+</button>
          </div>
        </div>
        <form class="search-form col-12 col-lg-auto mb-lg-0 me-lg-auto">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search" />
        </form>
        <div class="text-end" v-if="!isAuthenticated">
          <button type="button" class="header-login-button" @click="goToLogin">Sign-in</button>
          <button type="button" class="header-signup-button" @click="gotoRegistrationPage">
            Register
          </button>
        </div>
        <div class="text-end" v-if="isAuthenticated">
          <button type="button" class="header-signup-button" @click="gotoProfilePage">
            My Profile
          </button>
        </div>
        <div class="text-end" v-if="isAuthenticated && !isAdmin">
          <button type="button" class="header-rate-button" @click="gotoRatingPage">
            Rate an Event
          </button>
        </div>
        <div class="text-end" v-if="isAuthenticated && isAdmin">
          <button type="button" class="header-users-button" @click="gotoAdminDashboard">
            Admin Dashboard
          </button>
        </div>
        <div class="text-end" v-if="isAuthenticated && isAdmin">
          <button type="button" class="header-bulkemail-button" @click="gotoBulkEmail">
            Bulk Email to Users
          </button>
        </div>
        <div class="text-end" v-if="isAuthenticated">
          <button type="button" class="header-logout-button" @click="handleLogout">Logout</button>
        </div>
      </div>
      <div v-if="logoutsuccess" class="text-logout-success">
        Successfully logged out. You will now be redirected to the login page.
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-pills {
  flex-grow: 1;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.bg-light.text-white {
  color: #000;
  background-color: #f8f9fa;
}

.nav-link.active {
  color: #fff;
  background-color: #c43965;
  border-radius: 5px;
  transform: translateY(-2px);
}

.nav-link.active:hover {
  color: #fff;
  background-color: #c43965;
  border-radius: 5px;
}

.nav-link {
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    transform 0.3s ease;
  color: #085125;
  padding: 10px 15px;
  border-radius: 5px;
  display: block;
}

.nav-link:hover {
  color: #c43965;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-link:focus,
.nav-link:active {
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.logo-fluid {
  max-width: 80px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 15px;
  top: 10px;
}

.font-size-controls button {
  background-color: #e7e7e7;
  color: #333;
  border: 2px solid #ccc;
  padding: 6px 12px;
  margin-right: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.font-size-controls button:hover {
  background-color: #d6d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.search-form {
  flex-grow: 1;
  max-width: 500px;
  padding: 0 15px;
}

.form-control {
  border-radius: 5px;
  margin: 10px auto;
  align-content: center;
  border: 1px solid #ced4da;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}

.header-login-button {
  background-color: #2b8836;
  color: white;
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-login-button:hover {
  background-color: #73cf4c;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-login-button:active {
  background-color: #3d8a1f;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.header-signup-button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: rgb(158, 155, 155);
  border-style: groove;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-signup-button:hover {
  background-color: #179d79;
  color: rgb(255, 255, 255);
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-signup-button:active {
  background-color: #1f8a21;
  color: rgb(255, 255, 255);
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.header-rate-button {
  background-color: #33c2bf;
  color: rgb(0, 0, 0);
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-rate-button:hover {
  background-color: #41e5f1;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-rate-button:active {
  background-color: #2fc9d1;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.header-users-button {
  background-color: #33c2bf;
  color: rgb(0, 0, 0);
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-users-button:hover {
  background-color: #41e5f1;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-users-button:active {
  background-color: #2fc9d1;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.header-bulkemail-button {
  background-color: #1a6caf;
  color: white;
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-bulkemail-button:hover {
  background-color: #32bac4;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-bulkemail-button:active {
  background-color: #2ddae3;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.header-logout-button {
  background: linear-gradient(135deg, #dd0e07c0 0%, #660420 100%);
  background-color: #dd0e07c0;
  color: white;
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.header-logout-button:hover {
  background-color: #e84128;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.header-logout-button:active {
  background-color: #fc0606e4;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.text-logout-success {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  color: #27ae60;
  font-size: 1.1rem;
  opacity: 0;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
