<template>
  <div class="header-row"></div>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 mb-4">
        <h1 class="text-center">Administrator Dashboard</h1>
        <p class="text-muted text-center">
          Here you can manage the app using interactive tables and charts
        </p>
      </div>
    </div>
    <div class="row justify-content-center col-12">
      <div class="chart-container col-6 col-lg-6 col-md-8 mb-3">
        <GChart type="PieChart" :data="genderChartData" :options="genderChartOptions" />
        <div class="d-grid gap-2">
          <button class="btn btn-primary mt-2" @click="countGenderData">Users by Gender</button>
          <button class="btn btn-primary mt-2" @click="countIsAustralianData">
            Users by Nationality
          </button>
        </div>
      </div>
      <div class="chart-container col-6 col-lg-6 col-md-8 mb-3">
        <GChart type="ColumnChart" :data="eventChartData" :options="eventChartOptions" />
        <div class="d-grid gap-2">
          <button class="btn btn-primary mt-2" @click="countEventsByDate">Events by date</button>
          <button class="btn btn-primary mt-2" @click="countEventsByLocation">
            Events by location
          </button>
          <button class="btn btn-primary mt-2" @click="countEventsByRating">
            Events by rating
          </button>
        </div>
      </div>
    </div>
    <div class="row justify-content-center col-12">
      <div class="col-sm-6 text-center">
        <button type="button" class="btn btn-success-1 btn-lg mt-3" @click="gotoManageUsers">
          Manage Users
        </button>
      </div>
      <div class="col-sm-6 text-center">
        <button type="button" class="btn btn-success-2 btn-lg mt-3" @click="gotoManageEvent">
          Manage Events
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { db } from '../firebaseConfig.js'
import { getDocs, collection } from 'firebase/firestore'

export default {
  components: {
    GChart
  },
  setup() {
    const router = useRouter()
    const users = ref([])

    const genderChartData = ref([
      ['Gender', 'Number'],
      ['Male', 0],
      ['Female', 0]
    ])

    const genderChartOptions = ref({
      title: 'User Demographics by Gender',
      pieHole: 0.4,
      is3D: true
    })

    const eventChartData = ref([])
    const eventChartOptions = ref({
      title: 'Event Analysis',
      hAxis: { title: 'Category' },
      vAxis: { title: 'Count' },
      legend: 'none'
    })

    // Method to navigate to rating page
    const gotoManageUsers = () => {
      router.push({ name: 'ManageUsers' })
    }
    // Method to navigate to manage event page
    const gotoManageEvent = () => {
      router.push({ name: 'ManageEvent' })
    }

    const countGenderData = async () => {
      const tempUsers = []
      const querySnapshot = await getDocs(collection(db, 'SAHusers'))
      let maleCount = 0
      let femaleCount = 0

      querySnapshot.forEach((doc) => {
        let userData = doc.data()
        userData.id = doc.id
        tempUsers.push(userData)
        // Count gender
        if (userData.gender === 'male') maleCount++
        if (userData.gender === 'female') femaleCount++
      })

      users.value = [...tempUsers] // Updating the users reactive data
      genderChartData.value = [
        ['Gender', 'Number'],
        ['Male', maleCount],
        ['Female', femaleCount]
      ]
    }

    const countIsAustralianData = async () => {
      const tempUsers = []
      const querySnapshot = await getDocs(collection(db, 'SAHusers'))
      let yesAustralian = 0
      let noAustralian = 0

      querySnapshot.forEach((doc) => {
        let userData = doc.data()
        userData.id = doc.id
        tempUsers.push(userData)
        if (userData.isAustralian === true) yesAustralian++
        if (userData.isAustralian === false) noAustralian++
      })

      users.value = [...tempUsers] // Updating the users reactive data
      genderChartData.value = [
        ['Is Autralian', 'Number'],
        ['Australian', yesAustralian],
        ['Not Australian', noAustralian]
      ]
    }

    const countEventsByDate = async () => {
      const events = []
      const dateCount = new Map()
      const querySnapshot = await getDocs(collection(db, 'SAHevents'))
      const targetYear = '2024'

      querySnapshot.forEach((doc) => {
        let eventData = doc.data()
        let dateParts = eventData.eventdate.split('/')
        let year = dateParts[2]
        let month = dateParts[1]

        if (year === targetYear) {
          dateCount.set(month, (dateCount.get(month) || 0) + 1)
        }
      })

      Array.from(dateCount.keys())
        .sort()
        .forEach((key) => {
          events.push([key, dateCount.get(key)])
        })

      eventChartData.value = [['Month', 'Number of Events'], ...events]
    }

    const countEventsByLocation = async () => {
      const events = []
      const locationCount = new Map()
      const educationalRegex = /university|school/i // Regex to match 'university' or 'school', case insensitive

      const querySnapshot = await getDocs(collection(db, 'SAHevents'))

      querySnapshot.forEach((doc) => {
        let eventData = doc.data()
        let location = eventData.eventlocation

        // Check if the location is an educational facility
        let category = educationalRegex.test(location)
          ? 'Educational Facility'
          : 'Non-Educational Facility'

        // Count events in each category
        locationCount.set(category, (locationCount.get(category) || 0) + 1)
      })

      // Convert the Map to an array for charting
      for (let [key, value] of locationCount) {
        events.push([key, value])
      }

      eventChartData.value = [['Location Category', 'Number of Events'], ...events]
    }

    const countEventsByRating = async () => {
      const events = []
      const ratingCount = new Map()

      // Define rating categories
      const getRatingCategory = (rating) => {
        if (rating >= 4.5) return '4.5 - 5.0'
        else if (rating >= 4.0) return '4.0 - 4.4'
        else if (rating >= 3.5) return '3.5 - 3.9'
        else if (rating >= 3.0) return '3.0 - 3.4'
        else if (rating >= 2.5) return '2.5 - 2.9'
        else if (rating >= 2.0) return '2.0 - 2.4'
        else if (rating >= 1.5) return '1.5 - 1.9'
        else if (rating >= 1.0) return '1.0 - 1.4'
        else return 'Below 1.0'
      }

      const querySnapshot = await getDocs(collection(db, 'SAHevents'))

      querySnapshot.forEach((doc) => {
        let eventData = doc.data()
        let ratingCategory = getRatingCategory(eventData.eventrating)

        // Count events in each rating category
        ratingCount.set(ratingCategory, (ratingCount.get(ratingCategory) || 0) + 1)
      })

      // Convert the Map to an array for charting
      for (let [key, value] of ratingCount) {
        events.push([key, value])
      }

      eventChartData.value = [['Rating Category', 'Number of Events'], ...events]
    }

    onMounted(() => {
      countGenderData()
      countEventsByDate()
    })

    return {
      gotoManageUsers,
      gotoManageEvent,
      countGenderData,
      countIsAustralianData,
      countEventsByDate,
      countEventsByLocation,
      countEventsByRating,
      genderChartData,
      genderChartOptions,
      eventChartData,
      eventChartOptions
    }
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

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

h1 {
  font-weight: bold;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  height: auto;
}

.gchart {
  width: 100%;
  height: auto;
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

.btn-success-1 {
  background-color: #9e4c12;
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

.btn-success-1:hover {
  background-color: #c47d32;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.btn-success-1:active {
  background-color: #f98512;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.btn-success-2 {
  background-color: #79129e;
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

.btn-success-2:hover {
  background-color: #9b32c4;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.btn-success-2:active {
  background-color: #ed12f9;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}
</style>
