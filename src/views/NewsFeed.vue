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
  <div class="news-feed" id="contentToTranslate">
    <h1>News Feed</h1>
    <h3>Welcome to our latest news and gallery section.</h3>

    <section>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>Recent News</h2>
        <div class="slideshow-container">
          <img src="@/assets/images/news_1.png" alt="News 1" class="img-fluid" />
          <h3 class="text-title">
            Breakthrough in Cancer Treatment Shows Promise in Early Trials
          </h3>
          <p class="text">
            In a significant development for cancer treatment, researchers have announced promising
            results from early clinical trials of a new drug designed to target and destroy cancer
            cells with unprecedented precision. The drug, known as “TargetX,” utilizes a novel
            mechanism that specifically targets the DNA repair processes in cancer cells, ausing
            them to self-destruct while sparing healthy cells. This approach has shown remarkable
            effectiveness in patients with advanced forms of cancer, particularly in those who have
            not responded to traditional therapies. The trials, conducted across multiple centers,
            revealed that over 60% of patients experienced a significant reduction in tumor size,
            with minimal side effects. While these findings are preliminary, they offer hope for a
            new class of treatments that could revolutionize cancer therapy in the coming years.
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <h2>Gallery</h2>
        <img src="@/assets/images/event_1.png" alt="Event info 1" class="img-fluid" />
        <h3 class="text-title">Charity event in Pakenham on Friday, 2 August 2024.</h3>
        <img src="@/assets/images/event_2.png" alt="Event info 2" class="img-fluid" />
        <h3 class="text-title">Charity event in Pakenham on Thursday, 4 July 2024.</h3>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const highContrastMode = ref(false)

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
  const textElements = content.querySelectorAll('h1, h2, h3, p')

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

.font-translate-controls {
  border: #d6d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 2px;
  margin: 20px;
}

.lang-selection {
  margin: 10px;
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
  padding: 10px 60px;
  color: white;
  margin-bottom: 20px;
}

.news-feed {
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

.news-feed h1 {
  color: var(--h1-contrast-toggle-color);
  margin-bottom: 30px;
}

.news-feed h2 {
  color: var(--h2-contrast-toggle-color);
  margin-bottom: 20px;
  margin-top: 20px;
}

.text-title {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: bold;
}

.slideshow-container,
.gallery-container {
  position: relative;
  max-width: 100%;
  margin: 20px 0;
}

.newsSlide,
.galleryItem {
  display: block;
  width: 100%;
  overflow: hidden;
}

.newsSlide img,
.galleryItem img {
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

.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

.galleryItem {
  margin-top: 20px;
}

.caption {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}
</style>
