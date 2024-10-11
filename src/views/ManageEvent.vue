<template>
  <div class="header-row"></div>
  <div class="container">
    <h1>Add an Event</h1>
    <form @submit.prevent="addEvent" class="col-12">
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="eventname">Event Name:</label>
          <input type="text" v-model="eventname" id="eventname" required class="form-control" />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="eventdate">Event Date:</label>
          <input
            type="text"
            v-model="eventdate"
            id="eventdate"
            required
            class="form-control"
            @blur="validateEventDate(true)"
            @input="validateEventDate(false)"
          />
          <div v-if="eventdatewarning" class="text-danger">
            {{ eventdatewarning }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="eventlocation">Event Location:</label>
          <input
            type="text"
            v-model="eventlocation"
            id="eventlocation"
            required
            class="form-control"
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="eventtotaldonation">Event Total Donation:</label>
          <input
            type="text"
            v-model="eventtotaldonation"
            id="eventtotaldonation"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="eventtotaldonors">Event Total Donors:</label>
          <input
            type="text"
            v-model="eventtotaldonors"
            id="eventtotaldonors"
            required
            class="form-control"
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="eventnumofraters">Event Number of Raters:</label>
          <input
            type="text"
            v-model="eventnumofraters"
            id="eventnumofraters"
            required
            class="form-control"
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="eventrate">Event Rate:</label>
          <input type="text" v-model="eventrate" id="eventrate" required class="form-control" />
        </div>
      </div>
      <button type="submit" class="btn submit-btn">Add an Event</button>
    </form>
  </div>
  <EventList />
  <GetCountView />
</template>

<script>
import { ref } from 'vue'
import { db } from '../firebaseConfig.js'
import { collection, addDoc } from 'firebase/firestore'

import EventList from '../components/EventList.vue'
import GetCountView from '../components/GetEventCountView.vue'

export default {
  setup() {
    const eventname = ref('')
    const eventdate = ref('')
    const eventlocation = ref('')
    const eventtotaldonation = ref('')
    const eventtotaldonors = ref('')
    const eventnumofraters = ref('')
    const eventrate = ref('')
    const eventdatewarning = ref('')

    const validateEventDate = (blur) => {
      const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/ // Regex to check DD/MM/YYYY format
      if (!dateFormat.test(eventdate.value)) {
        if (blur) {
          console.log('warning')
          eventdatewarning.value = 'Date must be in DD/MM/YYYY format.'
        }
      } else {
        eventdatewarning.value = '' // Clear warning if the date format is correct
      }
    }

    const addEvent = async () => {
      validateEventDate(true)
      if (eventdatewarning.value !== '') {
        alert('Please correct the date format.')
        return
      }
      try {
        // Validate that input values are numeric where required
        const fields = [
          { value: eventrate.value, name: 'Event Rate' },
          { value: eventtotaldonation.value, name: 'Total Donation' },
          { value: eventtotaldonors.value, name: 'Total Donors' },
          { value: eventnumofraters.value, name: 'Number of Raters' }
        ]

        for (const field of fields) {
          const numericValue = Number(field.value)
          if (isNaN(numericValue)) {
            alert(`${field.name} must be a number`)
            return
          }
        }

        // Validate DD/MM/YYYY format
        const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/ // Regex to check DD/MM/YYYY format
        if (!dateFormat.test(eventdate.value)) {
          alert('Event date must be in DD/MM/YYYY format')
          return
        }

        await addDoc(collection(db, 'SAHevents'), {
          eventname: eventname.value,
          eventdate: eventdate.value,
          eventlocation: eventlocation.value,
          totaldonation: eventtotaldonation.value,
          totaldonors: eventtotaldonors.value,
          numberOfRaters: eventnumofraters.value,
          eventrating: eventrate.value
        })
        eventname.value = ''
        eventdate.value = ''
        eventlocation.value = ''
        eventtotaldonation.value = ''
        eventtotaldonors.value = ''
        eventnumofraters.value = ''
        eventrate.value = ''
        alert('Event added successfully')
      } catch (error) {
        console.error('Error adding event: ', error)
      }
    }

    return {
      eventname,
      eventdate,
      eventlocation,
      eventtotaldonation,
      eventtotaldonors,
      eventnumofraters,
      eventrate,
      eventdatewarning,
      validateEventDate,
      addEvent
    }
  },

  components: {
    EventList,
    GetCountView
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

h1 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #096b3a;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #096b3a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem; /* Slightly smaller font size on smaller screens */
  }
}

.container {
  text-align: center;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f9f9f9;
}

/* .form {
  display: flex;
  flex-direction: column;
} */

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-field {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  background-color: #2f84b5;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 20px auto;
}

.submit-btn:hover {
  background-color: #56ccd2;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  background-color: #3baec5;
  box-shadow: 0 2px #666;
  transform: translateY(4px);
}
</style>
