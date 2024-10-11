<template>
  <div class="thank-you-container">
    <h1>Thank You!</h1>
    <p>Your generous donation is greatly appreciated.</p>
    <div>
      <button @click="goHome" class="action-button">Go to Home Page</button>
      <button @click="printReceipt" class="action-button">Print Receipt again</button>
    </div>
  </div>
</template>

<script setup>
import { jsPDF } from 'jspdf'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const donationData = ref({
  firstname: '',
  lastname: '',
  amount: 0,
  date: '',
  isAnonymous: false
})

const clearDonationData = () => {
  localStorage.removeItem('donationData')
}

const printReceipt = () => {
  const { firstname, lastname, amount, date, isAnonymous } = donationData.value
  const numericAmount = parseFloat(amount)
  const booleanIsAnonymous = isAnonymous === 'true'

  console.log('Executing printReceipt:', {
    firstname,
    lastname,
    numericAmount,
    date,
    booleanIsAnonymous
  })

  if (!isNaN(numericAmount)) {
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

      doc.text(`Amount: $${numericAmount.toFixed(2)}`, 20, 100)

      if (!booleanIsAnonymous) {
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

onMounted(() => {
  const storedData = localStorage.getItem('donationData')
  if (storedData) {
    donationData.value = JSON.parse(storedData)
    console.log('Donation Data Retrieved:', donationData.value)
  }
})

const goHome = () => {
  router.push({ name: 'Home' })
  clearDonationData()
}
</script>

<style scoped>
.thank-you-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

.action-button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}

.action-button:hover {
  background-color: #45a049;
}
</style>
