<script setup>
import { collection, addDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { db } from '../firebaseConfig.js'
import { useRouter } from 'vue-router'

const formData = ref({
  firstname: '',
  lastname: '',
  username: '',
  password: '',
  isAustralian: false,
  motivation: '',
  gender: '',
  address: '',
  role: '',
  email: ''
})

const submitForm = () => {
  validateEmail(true)
  validateUsername(true)
  validateFirstName(true)
  validateLastName(true)
  validatePassword(true)

  if (
    errors.value.email === null &&
    errors.value.username === null &&
    errors.value.firstname === null &&
    errors.value.lastname === null &&
    errors.value.password === null &&
    errors.value.confirmPassword === null
  ) {
    submitData()
  } else {
    // If not all fields are valid, notify the user
    let errorMessage = 'Please correct the following errors:\n'
    for (const key in errors.value) {
      if (errors.value[key]) {
        errorMessage += `${key}: ${errors.value[key]}\n`
      }
    }
    alert(errorMessage)
  }
}

const clearForm = () => {
  formData.value = {
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    motivation: '',
    gender: '',
    address: '',
    role: '',
    email: ''
  }

  errors.value = {
    firstname: null,
    lastname: null,
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    motivation: null,
    role: null,
    address: null,
    email: null
  }
}

const errors = ref({
  firstname: null,
  lastname: null,
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  motivation: null,
  role: null,
  address: null,
  email: null
})

const validateEmail = (blur) => {
  if (!formData.value.email.includes('@')) {
    errors.value.email = blur ? 'Email must include "@" symbol' : null
  } else {
    errors.value.email = null
  }
}

const validateUsername = (blur) => {
  if (formData.value.username.length < 3) {
    errors.value.username = blur ? 'Username must be at least 3 characters' : null
  } else {
    errors.value.username = null
  }
}

const validateFirstName = (blur) => {
  const name = formData.value.firstname.trim()
  if (!name) {
    errors.value.firstname = blur ? 'First name is required.' : null
  } else if (/</.test(name) || />/.test(name)) {
    errors.value.firstname = 'Invalid characters in first name.'
  } else {
    errors.value.firstname = null
  }
}

const validateLastName = (blur) => {
  const name = formData.value.lastname.trim()
  if (!name) {
    errors.value.lastname = blur ? 'Last name is required.' : null
  } else if (/</.test(name) || />/.test(name)) {
    errors.value.lastname = 'Invalid characters in last name.'
  } else {
    errors.value.lastname = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Password does not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateReason = () => {
  const regex = /\bcharity\b/i
  if (regex.test(formData.value.motivation)) {
    errors.value.motivation = 'Its such a good thing to look for each other.'
  } else {
    errors.value.motivation = null
  }
}

const router = useRouter()
// Submitting form data to Firestore
const submitData = async () => {
  try {
    await addDoc(collection(db, 'SAHusers'), {
      ...formData.value
    })
    alert('Thank you for registering. Now you will be redirected to login page.')
    clearForm()
    router.push({ name: 'LoginPage' })
  } catch (error) {
    alert('Error adding document: ' + error.message)
  }
}

const gotoFirebaseRegistrationPage = () => {
  router.push({ name: 'FireRegister' })
}
</script>

<template>
  <div class="header-row"></div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <div class="row mt-3 mb-3">
          <div class="col-md-6 col-12">
            <div class="d-flex justify-content-center align-items-center">
              <img src="@/assets/images/Elderly1.png" alt="Elderly 1" class="img-fluid" />
            </div>
            <p class="quote">
              No act of kindness, no matter how small,<br />
              is ever wasted.<br />
              -Aesop-
            </p>
          </div>
          <div class="col-md-6 col-12 px-4 py-5">
            <h1 class="text-center">Hi there!</h1>
            <p class="text-center">Let's sign you up for an account.</p>
            <form @submit.prevent="submitForm">
              <div class="row mb-3 col-12">
                <div class="col-12">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    @blur="() => validateEmail(true)"
                    @input="() => validateEmail(false)"
                    v-model="formData.email"
                  />
                  <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                </div>
              </div>
              <div class="row mb-3 col-12">
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    @blur="() => validateUsername(true)"
                    @input="() => validateUsername(false)"
                    v-model="formData.username"
                  />
                  <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
                </div>

                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="role" class="form-label">Role</label>
                  <select class="form-select" id="role" v-model="formData.role" required>
                    <option value="">Select a role</option>
                    <option value="administrator">Administrator</option>
                    <option value="donor">Donor</option>
                    <option value="organiser">Organiser</option>
                    <option value="elderly">Elderly</option>
                  </select>
                </div>
              </div>
              <div class="row mt-3 mb-3 col-12">
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="firstname" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstname"
                    @blur="() => validateFirstName(true)"
                    @input="() => validateFirstName(false)"
                    v-model="formData.firstname"
                  />
                  <div v-if="errors.firstname" class="text-danger">{{ errors.firstname }}</div>
                </div>
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="lastname" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastname"
                    @blur="() => validateLastName(true)"
                    @input="() => validateLastName(false)"
                    v-model="formData.lastname"
                  />
                  <div v-if="errors.lastname" class="text-danger">{{ errors.lastname }}</div>
                </div>
              </div>
              <div class="row mt-3 mb-3 col-12">
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    @blur="() => validatePassword(true)"
                    @input="() => validatePassword(false)"
                    v-model="formData.password"
                  />
                  <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                </div>
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="confirm-password" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirm-password"
                    @blur="() => validateConfirmPassword(true)"
                    @input="() => validateConfirmPassword(false)"
                    v-model="formData.confirmPassword"
                  />
                  <div v-if="errors.confirmPassword" class="text-danger">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
              </div>

              <div class="row mt-3 mb-3 col-12">
                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="isAustralian"
                      v-model="formData.isAustralian"
                    />
                    <label class="form-check-label" for="isAustralian">Australian Resident?</label>
                  </div>
                </div>

                <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <label for="gender" class="form-label">Gender</label>
                  <select class="form-select" id="gender" v-model="formData.gender" required>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div class="row mt-3 mb-3 col-12">
                <label for="motivation" class="form-label">Motivation</label>
                <textarea
                  class="form-control"
                  id="motivation"
                  rows="3"
                  @input="() => validateReason(true)"
                  v-model="formData.motivation"
                ></textarea>
                <div v-if="errors.motivation">{{ errors.motivation }}</div>
              </div>
              <div class="row mt-3 mb-3 col-12">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" v-model="formData.address" />
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2">Submit</button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="gotoFirebaseRegistrationPage"
                >
                  Register with Gmail
                </button>
              </div>
            </form>
          </div>
        </div>
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
  font-size: large;
  text-align: right;
  padding-right: 20px;
}

.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 100vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.quote {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 1.5rem;
  color: #555;
  text-align: center;
  margin-top: 5rem;
}

.form {
  text-align: center;
  margin-top: 50px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
