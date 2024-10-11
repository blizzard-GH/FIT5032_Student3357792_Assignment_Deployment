<template>
  <div class="container">
    <button @click="authenticate" class="button">Log in with Google</button>
    <button @click="checkToken" class="button">Check Access Token</button>
    <div v-if="tokenStatus">
      <p class="token-status">Access Token: {{ accessToken }}</p>
    </div>
    <div v-if="events.length">
      <h2>Upcoming Events:</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          {{ event.summary }} ({{ new Date(event.start.dateTime).toLocaleString() }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [],
      tokenStatus: ''
    }
  },
  methods: {
    authenticate() {
      const clientId = '678724343602-bbfeqfktbcjgiqpl2iet9aeoffn7e153'; // Replace with your Client ID
      const redirectUri = 'http://localhost:5173/calendarView'; // Adjust based on your frontend URL
      const scope = 'https://www.googleapis.com/auth/calendar.events.readonly';
      const url = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=consent`;
      window.location.href = url;
    },
    fetchEvents() {
      const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
      if (accessToken) {
        fetch(
          `https://us-central1-your-project.cloudfunctions.net/getCalendarEvents?accessToken=${accessToken}`
        )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!data || !data.length) {
            console.log('No events found or incorrect data structure:', data);
            return;
          }
          this.events = data;
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
          this.tokenStatus = 'Error in fetching token';
        });
      }
    },
    checkToken() {
      const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
      if (accessToken) {
        this.tokenStatus = 'Token Fetched';
      } else {
        this.tokenStatus = 'Token Not Found';
      }
    }
  },
  mounted() {
    if (window.location.hash) {
      this.fetchEvents();
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}
.button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4285f4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.button:hover {
  background-color: #357ae8;
}
.token-status {
  margin: 20px;
  color: #333;
  font-size: 18px;
}
</style>