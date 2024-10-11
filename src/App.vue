<script setup>
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <header>
    <MainHeader />
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <MainFooter />
  </footer>
</template>

<style scoped></style>
