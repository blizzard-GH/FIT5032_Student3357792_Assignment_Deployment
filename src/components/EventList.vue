<template>
  <div class="main-container">
    <div>
      <h1>Event list</h1>
      <h2>Filtered Result:</h2>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Total Donations</th>
              <th>Total Donors</th>
              <th>Number of Raters</th>
              <th>Event Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.eventname }}</td>
              <td>{{ event.eventdate }}</td>
              <td>{{ event.eventlocation }}</td>
              <td>{{ event.totaldonation }}</td>
              <td>{{ event.totaldonors }}</td>
              <td>{{ event.numberOfRaters }}</td>
              <td>{{ event.eventrating.toFixed(2) }}</td>
              <td class="btn-action">
                <button class="btn update-btn" @click="updateEvents(event.id)">Update</button>
                <button class="btn delete-btn" @click="deleteEvents(event.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn">
          <button class="btn refresh-btn" @click="refreshAllEvents">Show all events</button>
          <button class="btn filter-btn" @click="filterEvents">Filter events</button>
          <button class="btn filter-btn" @click="orderEvents">Order events</button>
          <button class="btn filter-btn" @click="limitEvents">Limit events</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebaseConfig.js'
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  limit,
  orderBy
} from 'firebase/firestore'

export default {
  setup() {
    const events = ref([])
    const filterEvents = async () => {
      try {
        const filterVariable = prompt('Please enter the variable you want to filter:')
        const operator = prompt('Please enter an operator (> , < , ==):')
        const condition = prompt('Please enter a condition:')

        const conditionValue = isNaN(condition) ? condition : Number(condition)

        const validOperators = ['<', '>', '==']
        if (!validOperators.includes(operator)) {
          alert('Invalid operator. Please use <, >, or ==')
          return
        }

        const q = query(
          collection(db, 'SAHevents'),
          where(filterVariable, operator, conditionValue)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          alert(`No results found for ${filterVariable} ${operator} ${conditionValue}`)
          return
        }

        const eventsArray = []
        querySnapshot.forEach((doc) => {
          eventsArray.push({ id: doc.id, ...doc.data() })
        })
        events.value = eventsArray
      } catch (error) {
        console.error('Error fetching events:', error)
        alert(`Error: Failed to filter events.`)
      }
    }

    const orderEvents = async () => {
      try {
        const orderByField = prompt('Enter the field to order by:')
        const q = query(collection(db, 'SAHevents'), orderBy(orderByField, 'asc'))
        const querySnapshot = await getDocs(q)
        const eventsArray = []
        querySnapshot.forEach((doc) => {
          eventsArray.push({ id: doc.id, ...doc.data() })
        })
        events.value = eventsArray
      } catch (error) {
        console.error('Error fetching events:', error)
        alert(`Error: Failed to order events.`)
      }
    }

    const limitEvents = async () => {
      try {
        const limitValue = prompt('Enter the maximum number of results:')
        if (isNaN(limitValue)) {
          alert('You must input a number.')
          return
        }
        const q = query(collection(db, 'SAHevents'), limit(limitValue))
        const querySnapshot = await getDocs(q)
        const eventsArray = []
        querySnapshot.forEach((doc) => {
          eventsArray.push({ id: doc.id, ...doc.data() })
        })
        events.value = eventsArray
      } catch (error) {
        console.error('Error fetching events:', error)
        alert(`Error: Failed to limit events.`)
      }
    }

    const updateEvents = async (eventID) => {
      const newEventName = prompt('Please enter a new event name:')
      const newEventRate = prompt('Please enter a new event rate:')
      if (isNaN(newEventRate)) {
        alert('ISBN must be a numeric value.')
        return
      }
      try {
        const eventRef = doc(db, 'SAHevents', eventID)
        await updateDoc(eventRef, { eventname: newEventName, eventrating: newEventRate })
        alert('Event updated successfully.')
      } catch (error) {
        console.error('Error updating event:', error)
        alert('There is some errors in updating the event.')
      }
    }

    const deleteEvents = async (eventID) => {
      const confirmDeletion = confirm('Are you sure you want to delete this event?')
      if (confirmDeletion) {
        try {
          await deleteDoc(doc(db, 'SAHevents', eventID))
          refreshAllEvents()
        } catch (error) {
          console.error('Error deleting event:', error)
          alert('Failed to delete the event.')
        }
      }
    }

    const refreshAllEvents = async () => {
      try {
        const q = collection(db, 'SAHevents')
        const querySnapshot = await getDocs(q)
        const eventsArray = []
        querySnapshot.forEach((doc) => {
          let eventData = doc.data()
          eventsArray.push({ id: doc.id, ...eventData })
        })
        events.value = eventsArray
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    onMounted(() => {
      refreshAllEvents()
    })

    return {
      events,
      refreshAllEvents,
      updateEvents,
      deleteEvents,
      filterEvents,
      orderEvents,
      limitEvents
    }
  }
}
</script>

<style>
.main-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  margin-right: 10px;
}

.update-btn {
  background-color: #007bff;
  color: white;
}

.update-btn:hover {
  background-color: #0056b3;
  color: white;
  transform: scale(1.05);
}

.delete-btn {
  background-color: #35d9dc;
  color: rgb(0, 0, 0);
}

.delete-btn:hover {
  background-color: #23c8b5;
  transform: scale(1.05);
}

.refresh-btn {
  background-color: #35d9dc;
  color: rgb(0, 0, 0);
}

.refresh-btn:hover {
  background-color: #23c8b5;
  transform: scale(1.05);
}

.filter-btn {
  background-color: #35d9dc;
  color: rgb(0, 0, 0);
}

.filter-btn:hover {
  background-color: #23c8b5;
  transform: scale(1.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
