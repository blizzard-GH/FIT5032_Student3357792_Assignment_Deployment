<template>
  <div class="main-container">
    <div class="header-row"></div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
      <div class="map-header">
        <h1>Find The Nearest Healthcares to you.</h1>
        <p>
          Explore Healtcare locations on the map below. You can zoom in and move around to find
          where you can engage with our services.
        </p>
        <div class="row col-12">
          <p>Here you can search for locations, including your location!</p>
          <input class="map-input-box" v-model="searchQuery" placeholder="Search for places e.g., restaurants" />
          <button @click="searchPlaces">Search for places</button>
          <button @click="locateUser">Find My Location</button>
        </div>
        <div class="row col-12">
          <p>You can also find a route, type in your start and end location and click Get Route</p>
          <input class="map-input-box" v-model="startLocation" placeholder="Start location" />
          <input class="map-input-box" v-model="endLocation" placeholder="Destination" />
          <button @click="getRoute">Get Route</button>
        </div>
      </div>
      <div class="mapbox" id="map"></div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

export default {
  name: 'MapBoxMap',
  data() {
    return {
      map: null,
      startLocation: '',
      endLocation: '',
      searchQuery:''
    }
  },
  mounted() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136],
      zoom: 12,
      attributionControl: false
    })

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    this.map.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      }),
      'bottom-left'
    )
  },
  methods: {
    searchPlaces() {
      const apiURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.searchQuery)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      axios
        .get(apiURL)
        .then((response) => {
          const place = response.data.features[0]
          this.map.flyTo({
            center: place.center,
            zoom: 14
          })
          new mapboxgl.Marker()
            .setLngLat(place.center)
            .setPopup(new mapboxgl.Popup().setText(place.place_name)) // Add popup text
            .addTo(this.map)
        })
        .catch((error) => {
          alert('Failed to find the place')
          console.error(error)
        })
    },
    locateUser() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            this.map.flyTo({
              center: [longitude, latitude],
              zoom: 15
            })
            new mapboxgl.Marker()
              .setLngLat([position.coords.longitude, position.coords.latitude])
              .addTo(this.map)
          },
          () => {
            alert('Unable to retrieve your location')
          }
        )
      } else {
        alert('Geolocation is not supported by your browser')
      }
    },
    getRoute() {
      Promise.all([
        this.geocodeLocation(this.startLocation),
        this.geocodeLocation(this.endLocation)
      ]).then(([start, end]) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}&steps=true`
        axios
          .get(url)
          .then((response) => {
            this.displayRoute(response.data.routes[0].geometry)
          })
          .catch((error) => {
            console.error('Error fetching directions:', error)
          })
      })
    },
    geocodeLocation(location) {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      return axios.get(geocodeUrl).then((response) => {
        return response.data.features[0].center // Returns [longitude, latitude]
      })
    },
    displayRoute(geojson) {
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(geojson)
      } else {
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
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

.map-header {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: auto 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-input-box {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mapbox {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: auto 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: #137844;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.mapbox h1 {
  color: #178033;
  margin-bottom: 20px;
}

.mapbox p {
  text-align: left;
  color: #333;
  margin-bottom: 20px;
}

#map {
  height: 400px;
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
  width: fit-content;
  margin-bottom: 2.5rem;
  margin-top: 2.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
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
