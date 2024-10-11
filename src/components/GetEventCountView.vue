<template>
  <div id="app" class="app-container">
    <h1>Event Counter</h1>
    <button class="button" @click="getEventCount">Get Total Event Count</button>
    <p v-if="count !== null" class="count">Total Number of Events: {{ count }}</p>
    <p v-if="error" class="error">Error: {{ error.message }}</p>
  </div>
</template>

<style scoped>
.app-container {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #0b643c;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.button:hover {
  background-color: #21af71;
}

.count {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      count: null,
      error: null
    }
  },
  methods: {
    async getEventCount() {
      // Since the URL is the same for development and production, it's simplified.
      const baseUrl = 'https://countevents-wtvfi5kxbq-uc.a.run.app'

      try {
        const response = await axios.get(baseUrl)
        this.count = response.data.count
        this.error = null
      } catch (error) {
        console.error('Error fetching event count:', error)
        this.error = 'Failed to fetch data. Please try again later.'
        this.count = null
      }
    }
  }
}
</script>
