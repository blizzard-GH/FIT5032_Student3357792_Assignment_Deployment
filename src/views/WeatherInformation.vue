<template>
  <div class="weather-page">
    <h1>Check the weather before going to Healthcares</h1>
    <div class="row">
      <div class="left-col col-md-6">
        <div class="image-container">
          <img :src="currentGif" alt="Animated GIF" />
        </div>
        <p class="quote">
          Climate is what we expect,<br />
          weather is what we get.<br />
          -Mark Twain-
        </p>
      </div>
      <div class="right-col col-md-6">
        <h2>Check it here:</h2>
        <div>
          <label for="location">Location:</label>
          <input v-model="location" id="location" type="text" placeholder="Enter a city name" />
          <button @click="getWeatherByCity">Get Weather</button>
        </div>
        <div>
          <p class="or-separator">Or</p>
        </div>
        <div>
          <button @click="fetchCurrentLocationWeather">Use my location</button>
        </div>
        <div v-if="weatherDesciption" class="weather-description">
          <h3>Weather Description:</h3>
          <p>{{ weatherData.name }}, {{ weatherData.sys.country }}</p>
          <img :src="iconUrl" alt="WeatherIcon" />
          <p>{{ weatherDesciption }}</p>
          <h3>Temperature:</h3>
          <p>{{ temperature }} Degree Celcius</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import generalGif from '@/assets/animicons/general.gif'
import cloudyGif from '@/assets/animicons/cloudy.gif'
import rainGif from '@/assets/animicons/rain.gif'
import stormGif from '@/assets/animicons/storm.gif'
import sunGif from '@/assets/animicons/sun.gif'

const location = ref('')
const apikey = 'd69fb5e47fe65be6506187cce96b2e18'
const weatherDesciption = ref(null)
const temperature = ref('')
const currentGif = ref(generalGif)
const weatherData = ref('')
const iconUrl = ref('')

const fetchCurrentLocationWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
      try {
        const response = await axios.get(url)
        showWeatherData(response)
        weatherData.value = response.data
        iconUrl.value = `http://api.openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
      } catch (error) {
        console.error('Error fetching weather data.', error)
      }
    })
  }
}

const getWeatherByCity = async () => {
  const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location.value}&limit=1&appid=${apikey}`
  let lat
  let lon

  try {
    const geoResponse = await axios.get(geocodeUrl)
    lat = geoResponse.data[0].lat
    lon = geoResponse.data[0].lon
  } catch (geoError) {
    console.error('Error fetching geolocation:', geoError)
    weatherDesciption.value = 'Failed to retrieve geolocation.'
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`

  try {
    const response = await axios.get(weatherUrl)
    showWeatherData(response)
    weatherData.value = response.data
    iconUrl.value = `http://api.openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
  } catch (error) {
    console.error('Error fetching weather data:', error)
    weatherDesciption.value = 'Failed to retrieve weather data.'
  }
}

const showWeatherData = async (response) => {
  let mainDescription = response.data.weather[0].main
  weatherDesciption.value = response.data.weather[0].description
  temperature.value = response.data.main.temp
  switch (mainDescription) {
    case 'Clouds':
      currentGif.value = cloudyGif
      break
    case 'Rain':
      currentGif.value = rainGif
      break
    case 'Drizzle':
      currentGif.value = rainGif
      break
    case 'Thunderstorm':
      currentGif.value = stormGif
      break
    case 'Clear':
      currentGif.value = sunGif
      break
    default:
      currentGif.value = generalGif
  }
}

onMounted(() => {
  fetchCurrentLocationWeather()
})
</script>

<style scoped>
.weather-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.weather-page h1 {
  color: #178033;
  margin-bottom: 20px;
  text-align: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.left-col {
  padding: 15px;
}

.right-col {
  padding: 15px;
  /* display: flex;          
  flex-direction: column; 
  align-items: center; */
}

h2 {
  text-align: center;
}

.image-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.image-container img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.quote {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 1.5rem;
  color: #555;
  text-align: center;
}

.weather-app {
  text-align: center;
  border: 1px solid #0e901b;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

label {
  color: #343a40;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

input[type='text'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 20px;
}

.or-separator {
  font-size: x-large;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
  font-weight: bold;
  margin-top: 10px auto;
  margin-bottom: 10px auto;
  text-align: center;
}

.weather-description {
  font-size: 1.2rem;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
  color: #333;
  padding: 15px;
  margin: 20px auto;
  text-align: center;
  background-color: #ffffff;
  border: 3px solid #178033;
  border-radius: 8px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

button {
  background-color: #127c26;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 1rem auto;
  width: 100%;
}

button:hover {
  background-color: #32c45b;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

button:active {
  background-color: #28d751;
  transform: translateY(4px);
}
</style>
