<template>
  <div class="header-row"></div>
  <div class="user-profile">
    <h1>Your Profile</h1>
    <p>This is your profile page.</p>
    <div v-if="firebaseUser" class="firebaseNotification">
      You are logged in using Gmail account through Firebase Authentication
    </div>
    <div class="user-details" v-if="userData">
      <div class="detail-row">
        <div v-if="firebaseUser" class="detail-row">
          <strong>Login Email:</strong> {{ firebaseUser.email }}
        </div>
        <div v-else class="detail-row"><strong>Email:</strong> {{ userData.email }}</div>
      </div>
      <div class="detail-row"><strong>Username:</strong> {{ userData.username }}</div>
      <div class="detail-row"><strong>First Name:</strong> {{ userData.firstname }}</div>
      <div class="detail-row"><strong>Last Name:</strong> {{ userData.lastname }}</div>
      <div class="detail-row"><strong>Is Australian:</strong> {{ isAustralianText }}</div>
      <div class="detail-row"><strong>Motivation:</strong> {{ userData.motivation }}</div>
      <div class="detail-row"><strong>Gender:</strong> {{ userData.gender }}</div>
      <div class="detail-row"><strong>Address:</strong> {{ userData.address }}</div>
      <div class="detail-row"><strong>Role:</strong> {{ userData.role }}</div>
    </div>
    <form @submit.prevent="handleLogout">
      <div>
        <button type="submit" class="logout-button">Logout</button>
      </div>
      <div v-if="logoutsuccess" class="text-logout-success">
        Successfully logged out. You will now be redirected to the login page.
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const store = useStore()
const router = useRouter()
const auth = getAuth()

const logouterror = ref(null)
const logoutsuccess = ref(false)

const userData = computed(() => store.getters.getUserData)

const isAustralianText = computed(() => {
  return userData.value.isAustralian ? 'Yes' : 'No'
})

const firebaseUser = auth.currentUser

// Option 1: using const
// const handleSignOut = () => {
//   signOut(auth).then(() => {
//     router.push('/')
//   })
// }

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
</script>

<style scoped>
.user-profile {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 50px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.text-center {
  width: 100%;
  display: flex;
  justify-content: center;
}

.user-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  padding-bottom: 4rem;
}

.detail-row {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

p {
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 25px;
}

.logout-button {
  background: linear-gradient(135deg, #dd0e07c0 0%, #660420 100%);
  background-color: #dd0e07c0;
  color: white;
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

.logout-button:hover {
  background-color: #e84128;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.logout-button:active {
  background-color: #fc0606e4;
  box-shadow: 0 2px #666;
  transform: translateY(1px);
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

.firebaseNotification {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  color: #116b3a;
  margin-bottom: 20px;
}

.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0 auto;
  text-align: center;
  border-radius: 10px;
}

.header-row-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: large;
  text-align: right;
  padding-right: 20px;
}
</style>
