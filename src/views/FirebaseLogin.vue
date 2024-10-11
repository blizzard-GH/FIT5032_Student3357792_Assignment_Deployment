<template>
  <div class="header-row"></div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <img src="@/assets/images/Elderly2.png" alt="Elderly 2" class="img-fluid" />
      </div>
      <div class="col-md-6">
        <h1 class="text-center">HI!</h1>
        <p class="text-center">Let's log you in with a GMail.</p>
        <form @submit.prevent="signin">
          <div class="row mb-3 col-8">
            <div
              class="input-fields col-xs-12 col-sm-10 col-md-10 col-lg-8 col-xl-8 "
            >
              <label for="gmail" class="form-label">Gmail</label>
              <input
                type="text"
                class="form-control"
                id="gmail"
                v-model="gmail"
                @blur="() => validateGmail(true)"
                @input="() => validateGmail(false)"
              />
              <div v-if="mailBlurError" class="text-danger">{{ mailBlurError }}</div>
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
            <button type="submit" class="btn btn-primary me-2">Login with gmail account</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear Form</button>
            <div v-if="errMsg" class="text-danger">{{ errMsg }}</div>
            <div v-else-if="loginsuccess" class="text-success">Username and password correct.</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { db } from '../firebaseConfig.js'

const gmail = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()
const errMsg = ref(null)
const isLoggedIn = ref(false)
const loginsuccess = ref(false)
const mailBlurError = ref(null)
const store = useStore()

const signin = async () => {
  if (mailBlurError.value) {
    errMsg.value = 'Gmail is incorrect.'
    setTimeout(() => {
      errMsg.value = null
      clearForm()
    }, 1500)
    return
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, gmail.value, password.value)
    loginsuccess.value = true
    console.log(auth.currentUser)

    const userId = userCredential.user.uid

    await fetchAndStoreUserData(userId, userCredential)

    setTimeout(() => {
      loginsuccess.value = false
      clearForm()
      router.push('/userProfile')
    }, 700)
  } catch (error) {
    console.log(error.code)
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email.'
        break
      case 'auth/user-not-found':
        errMsg.value = 'No account with that email was found.'
        break
      case 'auth/wrong-password':
        errMsg.value = 'Incorrect password.'
        break
      default:
        errMsg.value = 'Email or password was incorrect.'
        break
    }
    setTimeout(() => {
      errMsg.value = null
      clearForm()
    }, 1500)
  }
}

const fetchAndStoreUserData = async (userId, userCredential) => {
  try {
    const userRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      console.log('Currently logged in user:', userCredential.user)
      const userData = docSnap.data()
      const user = userCredential.user.uid
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

const validateGmail = (blur) => {
  if (!gmail.value.includes('@')) {
    mailBlurError.value = blur ? 'Email must include "@" symbol' : null
  } else {
    mailBlurError.value = null
  }
}

const clearForm = () => {
  gmail.value = ''
  password.value = ''
  errMsg.value = null
  mailBlurError.value = null
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})
</script>

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

.input-fields {
  width: 100%; 
  max-width: 500px;
  min-width: 300px;
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
