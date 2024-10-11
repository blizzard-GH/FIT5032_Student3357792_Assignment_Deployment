<template>
  <div class="header-row"></div>
  <div class="main-container">
    <h1 class="title">
      Hello there! <br>I am your AI assistant.<br />
      Ask me anything!
    </h1>

    <form class="mb-5" @submit.prevent="fetchAnswer">
      <div>
        <textarea
          name="question"
          id="question"
          cols="30"
          rows="10"
          v-model="question"
          placeholder="Type your question here..."
        ></textarea>
      </div>
      <button class="submit-button" type="submit" :disabled="!question">
        {{ `${isLoading ? 'Asking AI...' : 'Ask AI'}` }}
      </button>
    </form>

    <div class="mb-10">
      <AIAnswer :answer="answer" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGetGenerativeModelGP } from '../getGenerativeModel.js'
import AIAnswer from '../components/GenAIAnswer.vue'

const question = ref('')
const answer = ref('')
const isLoading = ref(false)

const fetchAnswer = async () => {
  answer.value = ''
  isLoading.value = true

  try {
    answer.value = await useGetGenerativeModelGP(question.value)
  } catch (error) {
    console.log({ error })
  } finally {
    isLoading.value = false
    question.value = ''
  }
}
</script>

<style scoped>
.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background-color: #137844;
  color: white;
  padding: 10px 0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.main-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  text-align: center;
}

.title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 3rem;
  padding: 10px;
  color: #137844; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
  margin: 20px 0; 
  border-radius: 5px; 
}

.mb-5 {
  margin-bottom: 2rem; /* Adjusted for better spacing */
}

.mb-10 {
  margin-bottom: 4rem; /* Adjusted for better spacing */
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #162820;
  border-radius: 4px;
  box-sizing: border-box;
  resize: none; /* Disable resizing to maintain style */
}

textarea:focus {
  border: 1px solid #20cb7e;
}

.submit-button {
  background: linear-gradient(135deg, #07ddb9c0 0%, #0bd778 100%);
  background-color: #dd0e07c0;
  color: rgb(0, 0, 0);
  font-weight: 700;
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

.submit-button:hover {
  background-color: #92ea17;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.submit-button:active {
  background-color: #1ef3bae4;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}

.submit-button:disabled {
    background-color: #ccc;
    cursor: pointer;
}
</style>
