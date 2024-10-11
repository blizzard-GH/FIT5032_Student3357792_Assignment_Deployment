<template>
    <div class="answer-container">
        <p v-if="answer">{{ answer }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    answer: {
        type: String,
        default: "Answer will be displayed here."
    }
});
</script>

<style scoped>
.answer-container {
    padding: 20px;
    margin-top: 20px;
    background-color: #f4f4f9;
    border-left: 5px solid #5b9bd5;
    font-family: Arial, sans-serif;
    color: #333;
    font-size: 1.1em;
    line-height: 1.6;
}
</style>