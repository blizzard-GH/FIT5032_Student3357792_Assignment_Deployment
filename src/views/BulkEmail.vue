<template>
  <div class="header-row"></div>
  <div class="main-container container mt-5">
    <div class="sendbulkemail-title text-center mb-4">
      <h1>Send Bulk Emails</h1>
    </div>
    <div class="email-form">
      <form @submit.prevent="sendBulkEmail" class="w-100 mx-auto">
        <div class="d-flex justify-content-center mb-3">
          <button type="button" class="get-recipients-button" @click="getRecipients">
            Get Recipients
          </button>
        </div>
        <div v-if="recipients.length" class="recipients-list mb-3">
          <label>Recipients:</label>
          <div class="recipients-display">{{ recipients.join(', ') }}</div>
        </div>
        <div class="form-group mb-3">
          <label for="emailSubject" class="form-label">Email Subject:</label>
          <input
            type="text"
            id="emailSubject"
            v-model="emailSubject"
            class="form-control"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label for="emailBody" class="form-label">Email Body:</label>
          <textarea
            class="form-control custom-textarea"
            id="emailBody"
            v-model="emailBody"
            required
          ></textarea>
        </div>
        <div class="d-flex justify-content-center">
          <button type="submit" class="send-email-button">Send Email</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { db } from '../firebaseConfig.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default {
  setup() {
    const emailSubject = ref('')
    const emailBody = ref('')
    const recipients = ref([])

    const getRecipients = async () => {
      try {
        const usersRef = collection(db, 'SAHusers')
        const q = query(usersRef, where('role', 'in', ['donor', 'organiser']))
        const querySnapshot = await getDocs(q)
        recipients.value = querySnapshot.docs.map((doc) => doc.data().email)
        console.log('Recipients loaded:', recipients.value)
      } catch (error) {
        console.error('Error fetching recipients:', error)
      }
    }

    const sendBulkEmail = async () => {
      if (recipients.value.length === 0) {
        console.log('No recipients loaded. Please load recipients first.')
        return
      }
      try {
        const emailRecipients = recipients.value
        if (emailRecipients.length > 0) {
          fetch('https://us-central1-assignment-c3271.cloudfunctions.net/sendBulkEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subject: emailSubject.value,
              body: emailBody.value,
              recipients: emailRecipients
            })
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error sending emails:', error))
        } else {
          console.log('No recipients found or no valid emails.')
        }
      } catch (error) {
        console.error('Failed to send emails:', error)
      }
    }

    return { emailSubject, emailBody, recipients, getRecipients, sendBulkEmail }
  }
}
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
  font-size: large;
  text-align: right;
  padding-right: 20px;
}

.main-container {
  max-width: 800px;
}

.get-recipients-button {
  background-color: #109443;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.get-recipients-button:hover {
  background-color: #0ad149;
}

.recipients-list label {
  font-weight: bold;
}

.recipients-display {
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  overflow-x: auto;
  white-space: nowrap;
}

.sendbulkemail-title h1 {
  color: #097b1e;
  font-size: 3rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 300;
  font-style: normal;
}

.email-form form {
  max-width: 600px;
}

.custom-textarea {
  height: 200px;
  resize: both;
}

.send-email-button {
  background: linear-gradient(135deg, #109443c0 0%, #0ad149 100%);
  background-color: #107831c0;
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
  width: auto;
  align-self: center;
}

.send-email-button:hover {
  background-color: #14ab23;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.send-email-button:active {
  background-color: #239714e4;
  box-shadow: 0 2px #097b1e;
  transform: translateY(6px);
}
</style>
