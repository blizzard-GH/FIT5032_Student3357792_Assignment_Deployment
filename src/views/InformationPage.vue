<template>
  <div class="header-row"></div>
  <div class="body-header-row">
    <div class="font-translate-controls">
      <select class="lang-selection" id="langSelect">
        <option value="en" selected>English</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
      </select>
      <button @click="translateContent">Translate</button>
    </div>
    <div class="font-contrast-controls">
      <button @click="toggleHighContrast">High Contrast</button>
    </div>
  </div>
  <div class="information-page" id="contentToTranslate">
    <h1>Hi there! Welcome to our home page</h1>
    <section v-for="(info, index) in information" :key="index">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>{{ info.title }}</h2>

        <div class="slideshow-container">
          <img :src="imageSrc1" :alt="info.imageAlt" class="img-fluid" />
          <h3 class="text-title">
            {{ info.textTitle }}
          </h3>
          <p class="text">
            {{ info.textContent }}
          </p>
        </div>
      </div>
      <div v-if="errormsg" class="error-message">Error: {{ errormsg }}</div>
    </section>
    <section>
      <div class="organised-events col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>Events Organised by Us</h2>
        <p>
          We have organised numerous successful events, the statistics of which are displayed below.
          Select a category to view the corresponding event statistical data.
        </p>
        <div class="chart-container">
          <GChart type="ColumnChart" :data="eventChartData" :options="eventChartOptions" />
          <div class="row justify-content-center col-12">
            <form @submit.prevent="displayEventsData">
              <div class="mb-3 col-6">
                <label for="eventType" class="form-label">Choose data to display:</label>
                <select class="form-select" id="eventType" v-model="selectedEventType" required>
                  <option default value="date">Events by Date</option>
                  <option value="location">Events by Location</option>
                  <option value="rating">Events by Rating</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary col-6">Display</button>
            </form>
          </div>
        </div>
      </div>
      <div class="line-button-row justify-content-center align-items-center text-center col-12">
        <p class="mb-0">Feel like rating an event? Go to our rating page, but you need to login first:</p>
        <button type="button" class="btn btn-success-1 btn-lg ml-6" @click="gotoRatingEvent">
          Rate events
        </button>
      </div>
    </section>

    <section>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>Attendance Guidelines</h2>
        <p>
          Find all you need to know about how to attend our charity events, including registration,
          required materials, and other key details.
        </p>
      </div>
      <div class="line-button-row justify-content-center align-items-center text-center col-12">
        <p class="mb-0">Want to attend elderly care events? Let's go:</p>
        <button type="button" class="btn btn-success-1 btn-lg ml-6" @click="gotoUpcomingevents">
          Upcoming Events
        </button>
      </div>
    </section>

    <section>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>Donation Opportunities</h2>
        <p>
          You can attend events organised by us either by booking a spot or on location registering. Your donations help us
          continue our work with the elderly in Australia.
        </p>
      </div>
      <div class="line-button-row justify-content-center align-items-center text-center col-12">
        <p class="mb-0">Feel like donating? Go to our upcoming events to donate directly:</p>
        <button type="button" class="btn btn-success-1 btn-lg ml-6" @click="gotoUpcomingevents">
          Attend and donate
        </button>
      </div>
      <div class="line-button-row justify-content-center align-items-center text-center col-12">
        <p class="mb-0">Feel like donating online? Go to our donation page here:</p>
        <button type="button" class="btn btn-success-1 btn-lg ml-6" @click="gotoDonation">
          Donate online now
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import imageSrc1 from '@/assets/images/health_info_1.png'
import { GChart } from 'vue-google-charts'
import { useRouter } from 'vue-router'
import { db } from '../firebaseConfig.js'
import { getDocs, collection } from 'firebase/firestore'

export default {
  components: {
    GChart
  },
  setup() {
    const information = ref([])
    const errormsg = ref('')
    const informationPath = 'src/assets/json/informationhub.json'

    const selectedEventType = ref('date')
    const router = useRouter()
    const eventChartData = ref([])
    const eventChartOptions = ref({
      title: 'Event Analysis',
      hAxis: { title: 'Category' },
      vAxis: { title: 'Count' },
      legend: 'none'
    })

    const highContrastMode = ref(false)

    const gotoRatingEvent = () => {
      router.push({ name: 'RatingPage' })
    }

    const gotoDonation = () => {
      router.push({ name: 'DonationPage' })
    }

    const gotoUpcomingevents = () => {
      router.push({ name: 'UpcomingEvents' })
    }

    const toggleHighContrast = () => {
      console.log('Contrast toogled')
      highContrastMode.value = !highContrastMode.value
      if (highContrastMode.value) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
    }

    const translateContent = async () => {
      const lang = document.getElementById('langSelect').value
      const apiKey = 'AIzaSyBbkGvAURFvUMEkFNgJqkfaoHHvhyr6LW4'
      const content = document.getElementById('contentToTranslate')
      const textElements = content.querySelectorAll('h1, h2, h3, p, button, option, label')

      for (const element of textElements) {
        if (element.textContent.trim().length > 0) {
          const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                q: element.textContent,
                target: lang
              })
            }
          )
          const data = await response.json()
          element.textContent = data.data.translations[0].translatedText
        }
      }
    }

    const displayEventsData = async () => {
      switch (selectedEventType.value) {
        case 'date':
          await countEventsByDate()
          break
        case 'location':
          await countEventsByLocation()
          break
        case 'rating':
          await countEventsByRating()
          break
        default:
          console.error('Select a valid event type')
      }
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

    onMounted(async () => {
      await countEventsByDate()
      try {
        const response = await fetch(informationPath)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        information.value = data.information
      } catch (error) {
        errormsg.value = error.message
        console.error('Error fetching sections:', error.message)
      }
    })
    return {
      information,
      imageSrc1,
      selectedEventType,
      gotoRatingEvent,
      gotoDonation,
      gotoUpcomingevents,
      eventChartData,
      eventChartOptions,
      highContrastMode,
      toggleHighContrast,
      translateContent,
      displayEventsData,
      errormsg
    }
  }
}
</script>

<style>
:root {
  --h1-primary-color: #178033;
  --h1-contrast-toggle-color: var(--h1-primary-color);
  --h2-primary-color: #15ac9a;
  --h2-contrast-toggle-color: var(--h2-primary-color);
  --bg-primary-color: #f0edd8;
  --bg-contrast-toggle-color: var(--bg-primary-color);
}

.high-contrast {
  --h1-contrast-toggle-color: #000000;
  --h2-contrast-toggle-color: #000000;
  --bg-contrast-toggle-color: #ffffff;
}

.error-message {
  color: red;
  font-weight: bold;
}

.font-contrast-controls button {
  background-color: #e7e7e7;
  color: #333;
  border: 2px solid #ccc;
  padding: 6px 12px;
  margin-right: 8px;
  margin-left: auto;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.font-translate-controls {
  border: #d6d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 2px;
  margin: 20px;
}

.font-contrast-controls button:hover {
  background-color: #d6d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.font-translate-controls button {
  background-color: #e7e7e7;
  color: #333;
  border: 2px solid #ccc;
  padding: 6px 12px;
  margin-right: 8px;
  margin-left: auto;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.font-translate-controls button:hover {
  background-color: #d6d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lang-selection {
  margin: 10px;
  min-width: 150px;
  color: #000000;
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

.body-header-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* background-color: #178033; */
  padding: 10px 60px;
  color: white;
  margin-bottom: 20px;
}

.information-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 20px auto;
  padding: 20px;
  background-color: var(--bg-contrast-toggle-color);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.information-page h1 {
  color: var(--h1-contrast-toggle-color);
  margin-bottom: 30px;
}

.information-page h2 {
  color: var(--h2-contrast-toggle-color);
  margin-bottom: 20px;
  margin-top: 20px;
}

.slideshow-container {
  position: relative;
  max-width: 100%;
  margin: 20px 0;
}

.mySlides,
.prev,
.next {
  width: 100%;
  overflow: hidden;
}

.mySlides img {
  width: 100%;
  vertical-align: middle;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  margin-top: -22px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  background-color: #137844;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

.information-page p,
.information-page li {
  text-align: left;
  color: #333;
  margin-bottom: 10px;
}

.mySlides img {
  max-width: 100%;
  height: auto;
  display: block;
}

.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-container,
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-button-row {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.btn-primary {
  margin-top: 10px;
  width: auto;
  box-shadow: 0 4px #999;
}

.btn-primary:hover {
  margin-top: 10px;
  width: auto;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.btn-primary:active {
  margin-top: 10px;
  width: auto;
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
  margin: 20px 10px;
  margin-left: 10px;
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
</style>
