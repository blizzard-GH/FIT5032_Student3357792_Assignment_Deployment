<template>
  <div class="main-container">
    <div>
      <h1>Event list</h1>
      <h2>You can rate events below:</h2>
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
            <tr v-for="event in paginatedEvents" :key="event.id">
              <td>{{ event.eventname }}</td>
              <td>{{ event.eventdate }}</td>
              <td>{{ event.eventlocation }}</td>
              <td>{{ event.totaldonation }}</td>
              <td>{{ event.totaldonors }}</td>
              <td>{{ event.numberOfRaters }}</td>
              <td>{{ event.eventrating.toFixed(2) }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  v-model="event.userRating"
                  :disabled="event.alreadyRated"
                />
              </td>
              <td>
                <button
                  class="btn update-btn"
                  @click="confirmRating(event, user)"
                  :disabled="event.alreadyRated"
                >
                  Confirm Rating
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn">
          <button class="btn refresh-btn" @click="refreshAllEvents">Show all events</button>
          <button class="btn filter-btn" @click="filterEvents">Search events</button>
          <button class="btn filter-btn" @click="orderEvents">Order events</button>
          <button class="btn filter-btn" @click="limitEvents">Limit events</button>
        </div>
        <div class="pagination-controls">
          <button class="btn" @click="prevPage" :disabled="currentPage <= 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn" @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebaseConfig.js'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  limit,
  orderBy
} from 'firebase/firestore'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const user = store.getters.getUser
    const events = ref([])

    const currentPage = ref(1)
    const eventsPerPage = ref(10) // Number of events to show per page

    const paginatedEvents = computed(() => {
      const start = (currentPage.value - 1) * eventsPerPage.value
      const end = start + eventsPerPage.value
      return events.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(events.value.length / eventsPerPage.value)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const filterEvents = async () => {
      try {
        const filterField = prompt(
          'Please enter the field you want to filter by (e.g., eventname):'
        )
        const searchKeyword = prompt('Please enter the keyword to search for:')

        // This is an exact match filter setup; Firestore doesn't support partial matches natively.
        const q = query(
          collection(db, 'SAHevents'),
          where(filterField, '==', searchKeyword)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          alert(`No results found for ${filterField} with keyword "${searchKeyword}"`)
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

    const confirmRating = async (event, userId) => {
      const userEventId = `${userId}_${event.id}`
      const usersRatedEventsRef = doc(db, 'usersratedevents', userEventId)
      const userEventDocSnap = await getDoc(usersRatedEventsRef)

      if (userEventDocSnap.exists()) {
        alert('You have already rated this event.')
        return
      }
      try {
        const eventRef = doc(db, 'SAHevents', event.id)
        const docSnap = await getDoc(eventRef)

        if (docSnap.exists()) {
          const eventData = docSnap.data()

          const newTotalRaters = eventData.numberOfRaters + 1

          if (isNaN(parseFloat(event.userRating))) {
            console.error('User rating is not a valid number:', event.userRating)
            alert('Invalid rating input.')
            return
          }
          const newEventRate =
            (eventData.eventrating * eventData.numberOfRaters + parseFloat(event.userRating)) /
            newTotalRaters
          // alert(`New Event Rate: ${newEventRate}`)

          await updateDoc(eventRef, {
            eventrating: newEventRate,
            numberOfRaters: newTotalRaters
          })

          await setDoc(usersRatedEventsRef, {
            userId: userId,
            eventId: event.id,
            rating: parseFloat(event.userRating),
            ratedAt: new Date()
          })

          alert(
            `Rating confirmed successfully. New rate for this event: ${newEventRate.toFixed(2)}`
          )
          refreshAllEvents()
        } else {
          console.error('Event does not exist!')
        }
      } catch (error) {
        console.error('Error confirming event rating:', error)
        alert('Failed to confirm rating.')
      }
    }

    const refreshAllEvents = async () => {
      try {
        const q = collection(db, 'SAHevents')
        const querySnapshot = await getDocs(q)
        const eventsArray = []
        querySnapshot.forEach(async (doc) => {
          // for (const documentSnapshot of querySnapshot.docs) {
          let eventData = doc.data()
          // const userEventId = `${user.value}_${eventData.id}`
          // const userEventRef = doc(db, 'usersratedevents', userEventId)
          // const userEventSnap = await getDoc(userEventRef)
          eventsArray.push({
            id: doc.id,
            ...eventData,
            userRating: null
            // alreadyRated: userEventSnap.exists()
          })
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
      user,
      events,
      currentPage,
      totalPages,
      paginatedEvents,
      nextPage,
      prevPage,
      refreshAllEvents,
      confirmRating,
      filterEvents,
      orderEvents,
      limitEvents
    }
  },
  components: {
    // StarRating
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

input:disabled,
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
