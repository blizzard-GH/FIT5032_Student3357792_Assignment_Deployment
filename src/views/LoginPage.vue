<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, query, where, getDocs, getDoc } from 'firebase/firestore'
import { useStore } from 'vuex'
import { db } from '../firebaseConfig.js'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const loginerror = ref(null)
    const loginsuccess = ref(false)
    const router = useRouter()
    const store = useStore()

    const clearForm = () => {
      username.value = ''
      password.value = ''
    }

    const gotoFirebaseLogin = () => {
      router.push({ name: 'FireLogin' })
    }

    const handleLogin = async () => {
      try {
        const usersRef = collection(db, 'SAHusers')
        const q = query(
          usersRef,
          where('username', '==', username.value),
          where('password', '==', password.value)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          await fetchAndStoreUserData(querySnapshot.docs[0].id)
          loginsuccess.value = true
          setTimeout(() => {
            loginsuccess.value = false
            clearForm()
            router.push({ name: 'UserProfilePage' })
          }, 700)
        } else {
          loginerror.value = 'Invalid username or password!'
          setTimeout(() => {
            loginerror.value = null
            clearForm()
          }, 700)
        }
      } catch (error) {
        loginerror.value = 'Error during login: ' + error.message
        setTimeout(() => {
          loginerror.value = null
        }, 700)
      }
    }

    const fetchAndStoreUserData = async (userId) => {
      try {
        const userRef = doc(db, 'SAHusers', userId)
        const docSnap = await getDoc(userRef)
        console.log('Logging and storing data')
        if (docSnap.exists()) {
          const userData = docSnap.data()
          const user = userId
          store.dispatch('login', { user, userData })
          console.log(`User data: ${JSON.stringify(user)}`)
          console.log(`User data: ${JSON.stringify(userData)}`)
        } else {
          console.log('No user data found.')
        }
      } catch (error) {
        console.error('Error fetching user data: ', error.message)
      }
    }

    return {
      username,
      password,
      loginerror,
      loginsuccess,
      clearForm,
      gotoFirebaseLogin,
      handleLogin
    }
  }
}
</script>

<template>
  <div class="header-row"></div>
  <div class="container mt-5">
    <div class="row">
      <div class="image-group col-md-6 d-flex justify-content-center align-items-center">
        <img src="@/assets/images/Elderly2.png" alt="Elderly 2" class="img-fluid" />
      </div>
      <div class="form-group col-md-6">
        <h1 class="text-center">HI!</h1>
        <p class="text-center">Let's log you in.</p>
        <form @submit.prevent="handleLogin">
          <div class="row mb-3 col-8">
            <div
              class="input-fields col-xs-12 col-sm-10 col-md-10 col-lg-8 col-xl-8"
            >
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="username" />
            </div>
          </div>
          <div class="row mb-3 col-8">
            <div
              class="input-fields col-xs-12 col-sm-10 col-md-10 col-lg-8 col-xl-8"
            >
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" />
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear Form</button>
            <button type="button" class="btn btn-secondary" @click="gotoFirebaseLogin">
              Login with Gmail
            </button>
            <div v-if="loginerror" class="text-danger">{{ loginerror }}</div>
            <div v-else-if="loginsuccess" class="text-success">Username and password correct.</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0 auto;
  text-align: center;
  border-radius: 10px;
}

.header-row-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: right;
  padding-right: 20px;
  font-size: large;
  color: #275fda;
}

.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 100vw;
  margin: 0 auto;
  padding: 10px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: bold;
}

.btn {
  margin: 10px 0;
  padding: 10px 20px;
}

.text-center {
  margin-top: 20px;
}

.text-danger {
  margin-top: 10px;
  font-weight: bold;
}

.text-success {
  margin-top: 10px;
  font-weight: bold;
}

.input-fields {
  width: 100%; 
  max-width: 500px;
  min-width: 300px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0f6741;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  box-shadow: 0 4px #999;
}

.btn-primary:hover {
  background-color: #4b9118;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.btn-primary:active {
  background-color: #1f788a;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.btn-secondary {
  background-color: #b2e4cf;
  color: rgb(0, 0, 0);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  box-shadow: 0 4px #999;
}

.btn-secondary:hover {
  background-color: #9eda73;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.btn-secondary:active {
  background-color: #70e0cf;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}
</style>
