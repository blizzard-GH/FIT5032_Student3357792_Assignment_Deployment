<template>
  <div class="header-row"></div>
  <div class="contact-us">
    <h1>Contact Us</h1>

    <section class="contact-section">
      <div class="contact-info">
        <h2>Reach Out to Us</h2>
        <p>
          We would love to hear from you! Feel free to drop us an email for any inquiries or
          assistance.
        </p>
        <a class="email-link" href="mailto:seniorassistancehub@gmail.com">Send us an Email</a>
      </div>
    </section>

    <div class="contact-separator">
      <p>Or, you can fill in the form below to directly contact our team.</p>
    </div>

    <section class="contact-section">
      <div class="contact-info">
        <h2>Contact us directly</h2>
        <form @submit.prevent="handleContactSubmission" class="contact-form">
          <div class="form-group">
            <label for="event-name">Event Name:</label>
            <input v-model="eventName" type="text" id="event-name" name="event-name" required />
          </div>

          <div class="form-group">
            <label for="event-date">Event Date:</label>
            <input type="date" id="event-date" name="event-date" required />
          </div>

          <div class="form-group">
            <label for="event-details">Event Details:</label>
            <textarea id="event-details" name="event-details" required></textarea>
          </div>

          <button type="submit">Send to us</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  name: 'ContactUs',
  methods: {
    handleContactSubmission() {
    const eventName = ref('')
    const eventDate = ref('')
    const eventDetails = ref('')

    
    const emailData = {
      subject: `New Event Request: ${eventName.value}`,
      text: `Event Name: ${eventName.value}\nEvent Date: ${eventDate.value}\nDetails: ${eventDetails.value}`,
    };

    
    fetch('https://us-central1-assignment-c3271.cloudfunctions.net/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    })
    .then(response => {
      if (response.ok) {
        alert('Event request sent successfully!');
      } else {
        alert('Failed to send event request.');
      }
    })
    .catch(error => console.error('Error:', error));
    }
  }
}
</script>

<style scoped>
.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background-color: #137844;
  color: white;
  padding: 20px 0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.contact-us {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 70vw;
  margin: 20px auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  align-items: center;
}

.contact-us h1 {
  color: #178033;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.contact-section {
  background-color: #e8f5e9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #15ac9a;
}

.contact-info {
  text-align: center;
  align-items: center;
}

.contact-separator {
  text-align: center;
  font-size: large;
  font-weight: bolder;
}

.contact-us h2 {
  color: #15ac9a;
  margin-bottom: 15px;
}

.contact-us p {
  color: #333;
  font-size: 1.2em;
}

.email-link {
  display: inline-block;
  margin-top: 15px;
  font-size: 1.2em;
  color: white;
  background: linear-gradient(135deg, #4a90e2, #276fbf);
  padding: 12px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.email-link:hover {
  background: linear-gradient(135deg, #5ba3f7, #3581d6);
  transform: translateY(-3px); 
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); 
}

.email-link:active {
  background: linear-gradient(135deg, #2c6ba1, #1b4f7a);
  transform: translateY(2px); 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); 
}

.contact-us form {
  display: grid;
  grid-gap: 15px;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.contact-us input[type='text'],
.contact-us input[type='email'],
.contact-us input[type='date'],
.contact-us textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.contact-us button {
  background: linear-gradient(135deg, #0a8c3ec0 0%, #089522 100%);
  background-color: #0b6f17c0;
  color: white;
  border: rgb(123, 123, 123);
  border-style: double;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: block;
  width: fit-content;
  font-size: 16px;
  margin: 10px auto;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px #999;
  transition: all 0.3s;
}

.contact-us button:hover {
  background-color: #13ed3b;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.contact-us button:active {
  background-color: #0c6a1de4;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}
</style>
