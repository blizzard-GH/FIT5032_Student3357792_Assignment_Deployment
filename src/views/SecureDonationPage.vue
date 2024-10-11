<template>
  <div class="main-container">
    <div class="header-row"></div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
      <h1>Fill your donation details</h1>
      <p>Thank you for your charity. Please input your details below.</p>
      <p>After a successful donation, you will get a receipt in pdf format.</p>
      <div class="donation">
        <form @submit.prevent="submitDonation">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="isAnonymous"
              v-model="formData.isAnonymous"
            />
            <label class="form-check-label" for="isAnonymous">Do you want to be anonymous ?</label>
          </div>
          <div class="col-12">
            <label for="firstname" class="form-label">First Name:</label>
            <input type="text" class="form-control" id="firstname" v-model="formData.firstname" />
          </div>
          <div class="col-12">
            <label for="lastname" class="form-label">Last Name:</label>
            <input type="text" class="form-control" id="lastname" v-model="formData.lastname" />
          </div>
          <div class="col-12">
            <label for="amount" class="form-label">Donation Amount</label>
            <input
              type="text"
              class="form-control"
              id="amount"
              @blur="() => validateAmount(true)"
              @input="() => validateAmount(false)"
              v-model="formData.amount"
            />
            <div v-if="errors.amount" class="text-danger">
              {{ errors.amount }}
            </div>
          </div>

          <div class="row mt-3 mb-3">
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
          <div class="button-center">
            <button type="submit" class="donate-button">Donate Now</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, addDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { db } from '../firebaseConfig.js'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'

const formData = ref({
  isAnonymous: false,
  firstname: '',
  lastname: '',
  amount: '',
  motivation: '',
  date: new Date().toLocaleString()
})

const errors = ref({
  isAnonymous: false,
  firstname: '',
  lastname: '',
  amount: '',
  motivation: ''
})

const clearForm = () => {
  formData.value = ref({
    isAnonymous: false,
    firstname: '',
    lastname: '',
    amount: '',
    motivation: '',
    date: new Date().toLocaleString()
  })

  errors.value = ref({
    isAnonymous: false,
    firstname: null,
    lastname: null,
    amount: null,
    motivation: null
  })
}

const validateAmount = (blur) => {
  if (isNaN(formData.value.amount) || formData.value.amount === '') {
    if (blur) errors.value.amount = `You must input a valid number for the donation amount.`
  } else {
    errors.value.amount = null
  }
}

const validateReason = () => {
  const regex = /\bcharity\b/i
  if (regex.test(formData.value.motivation)) {
    errors.value.motivation = 'Thank you for your kindness.'
  } else {
    errors.value.motivation = null
  }
}

const submitDonation = () => {
  validateAmount(true)

  if (errors.value.amount === null) {
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

const router = useRouter()

const printReceipt = () => {
  const { firstname, lastname, amount, date, isAnonymous } = formData.value
  const formattedAmount = parseFloat(amount)

  console.log('Executing printReceipt3:', {
    firstname,
    lastname,
    formattedAmount,
    date,
    isAnonymous
  })

  if (!isNaN(formattedAmount)) {
    try {
      const doc = new jsPDF()

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(24)
      doc.setTextColor(60, 100, 196)
      doc.text('Thank You!', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' })

      doc.setFontSize(20)
      doc.setTextColor(0)
      doc.text(
        'Donation receipt for Senior Assistance Hub.',
        doc.internal.pageSize.getWidth() / 2,
        40,
        { align: 'center' }
      )

      doc.setFont('times', 'normal')
      doc.setFontSize(16)
      doc.setTextColor(0)

      doc.text(`Date: ${date}`, 20, 80)

      doc.text(`Amount: $${formattedAmount.toFixed(2)}`, 20, 100)

      if (!isAnonymous) {
        doc.setFontSize(14)
        doc.text(`Donor: ${firstname} ${lastname}`, 20, 120)
      }

      doc.setDrawColor(0)
      doc.setLineWidth(0.5)
      doc.line(20, 70, doc.internal.pageSize.getWidth() - 20, 70)

      doc.save('DonationReceipt.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }
}

const submitData = async () => {
  console.log('executing printreceipt1:', {
    firstName: formData.value.firstname,
    lastName: formData.value.lastname,
    amount: formData.value.amount,
    date: formData.value.date,
    isAnonymous: formData.value.isAnonymous
  })
  try {
    await addDoc(collection(db, 'SAHdonations'), {
      ...formData.value
    })
    alert('Thank you for donating. You will get the receipt.')
    router.push({
      name: 'DonationThankYouPage',
      params: {
        firstName: formData.value.firstname,
        lastName: formData.value.lastname,
        amount: parseFloat(formData.value.amount),
        date: formData.value.date,
        isAnonymous: formData.value.isAnonymous
      }
    })
    console.log('executing printreceipt2:', {
      firstName: formData.value.firstname,
      lastName: formData.value.lastname,
      amount: formData.value.amount,
      date: formData.value.date,
      isAnonymous: formData.value.isAnonymous
    })
    localStorage.setItem('donationData', JSON.stringify(formData.value))
    printReceipt()
    clearForm()
  } catch (error) {
    alert('Error adding document: ' + error.message)
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 70vh;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: larger;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background-color: #137844;
  color: white;
  padding: 10px 0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.donation {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: auto 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.donation h1 {
  color: #178033;
  margin-bottom: 20px;
}

.donation p {
  text-align: left;
  color: #333;
  margin-bottom: 20px;
}

.button-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.donate-button {
  background-color: #ec5f08;
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

.donate-button:hover {
  background-color: #f86307;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.donate-button:active {
  background-color: #e25b07;
  box-shadow: 0 2px #666;
  transform: translateY(1px);
}
</style>
