<template>
  <div>
     
    <section class="news-section">
      <div class="section-title">Новости</div>
      <div class="news-slider">
        <div v-for="(slide, index) in newsSlides" 
             :key="index" 
             class="news-slide"
             :class="{ active: currentSlide === index }">
          <div class="news-block">
            <div class="news-content">
              <img :src="slide.image" :alt="slide.title" class="news-image">
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </div>
        <div class="news-tabs">
          <button v-for="(_, index) in newsSlides" 
                  :key="index"
                  class="tab"
                  :class="{ active: currentSlide === index }"
                  @click="currentSlide = index">
          </button>
        </div>
      </div>
    </section>

    <section class="benefits-section">
      <div class="section-title">Почему стоит создавать мероприятия у нас?</div>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">🎓</div>
          <h3>Развитие колледжа</h3>
          <p>Создавайте мероприятия, которые помогут развивать наш колледж и привлекать новых студентов</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">👥</div>
          <h3>Сообщество</h3>
          <p>Объединяйте студентов, преподавателей и выпускников для обмена опытом и знаниями</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">💡</div>
          <h3>Инновации</h3>
          <p>Продвигайте новые идеи и проекты, которые могут изменить будущее образования</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🌟</div>
          <h3>Карьера</h3>
          <p>Создавайте возможности для профессионального роста и развития студентов</p>
        </div>
      </div>
    </section>

    <!-- Раздел с функциями сайта -->
    <section class="features-section">
      <div class="section-title">Возможности сайта</div>
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon">➕</div>
          <div class="feature-content">
            <h3>Создание мероприятий</h3>
            <p>Легко создавайте свои мероприятия, указывайте все детали, дату, время и место проведения.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">✅</div>
          <div class="feature-content">
            <h3>Участие в мероприятиях</h3>
            <p>Присоединяйтесь к интересным мероприятиям, просматривайте информацию и следите за обновлениями.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">👤</div>
          <div class="feature-content">
            <h3>Профиль пользователя</h3>
            <p>Управляйте своим профилем, просматривайте созданные и посещенные мероприятия.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔍</div>
          <div class="feature-content">
            <h3>Поиск и фильтрация</h3>
            <p>Находите мероприятия по названию, дате или другим параметрам.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="recommend-section">
      <div class="section-title">Мероприятия</div>
      
      <!-- Поле поиска -->
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Поиск мероприятий по названию..." class="search-input">
      </div>

      <div class="cards-grid">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :title="event.title"
          :description="event.description"
          @view="goToEvent(event.id)"
        >
          <template #footer>
            <div class="event-meta">
              <span>Создатель: {{ event.creator?.name }}</span>
              <span>Дата: {{ formatDate(event.date) }}</span>
            </div>
          </template>
        </EventCard>
      </div>
      <div class="buttons-row">
        <button class="btn">Дальше</button>
        <NuxtLink to="/offer" class="btn">Предложить мероприятие</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)
const newsSlides = ref([
  {
    title: 'Новый сайт мероприятий колледжа',
    description: 'Мы запустили новый сайт для организации и участия в мероприятиях колледжа. Теперь вы можете легко создавать события и присоединяться к ним!',
    image: '/images/news/site-launch.jpg'
  },
  {
    title: 'День открытых дверей в колледже',
    description: 'Приглашаем всех желающих на День открытых дверей! Узнайте больше о наших специальностях и возможностях обучения.',
    image: '/images/news/open-day.jpg'
  },
  {
    title: 'Новые образовательные программы',
    description: 'Колледж запускает новые образовательные программы в сфере IT. Успейте подать заявку на обучение!',
    image: '/images/news/new-programs.jpg'
  },
  {
    title: 'Студенческий хакатон',
    description: 'Приглашаем всех студентов принять участие в хакатоне по разработке веб-приложений. Призовой фонд - 100,000 рублей!',
    image: '/images/news/hackathon.jpg'
  }
])

const events = ref([])
const searchQuery = ref('') // Переменная для хранения поискового запроса

const fetchEvents = async () => {
  const res = await $fetch('/api/events')
  if (res.success) {
    events.value = res.events
  }
}
onMounted(() => {
  fetchEvents()
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % newsSlides.value.length
  }, 5000)
})

// Фильтрация мероприятий по названию
const filteredEvents = computed(() => {
  if (!searchQuery.value) {
    return events.value
  }
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event => event.title.toLowerCase().includes(query))
})

const goToEvent = (id) => {
  router.push(`/events/${id}`)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.news-section {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #5a6a7a;
  margin-bottom: 24px;
}

.news-slider {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #bfc9d1;
  overflow: hidden;
}

.news-slide {
  display: none;
  aspect-ratio: 16/9;
}

.news-slide.active {
  display: block;
}

.news-block {
  width: 100%;
  height: 100%;
  background: #f7f9fb;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-content {
  max-width: 800px;
  text-align: center;
}

.news-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.news-content h3 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.news-content p {
  font-size: 18px;
  color: #5a6a7a;
  line-height: 1.6;
}

.news-tabs {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.tab {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #bfc9d1;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.tab.active {
  background: #5a6a7a;
}

.benefits-section {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 32px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.benefit-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.benefit-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.benefit-card h3 {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 12px;
}

.benefit-card p {
  color: #5a6a7a;
  font-size: 16px;
  line-height: 1.5;
}

.features-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 32px;
}

.features-list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  border-left: 5px solid var(--main-blue);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 36px;
  flex-shrink: 0;
  padding-top: 5px;
}

.feature-content h3 {
  color: var(--main-blue-dark);
  font-size: 22px;
  margin: 0 0 8px 0;
}

.feature-content p {
  color: #444;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
}

.recommend-section {
  max-width: 1400px;
  margin: 40px auto 60px auto;
  padding: 0 32px;
}

.search-bar {
  margin-bottom: 30px; /* Немного больше отступ */
  max-width: 600px; /* Увеличим максимальную ширину */
  margin-left: auto;
  margin-right: auto;
  position: relative; /* Для позиционирования иконки, если понадобится */
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px; /* Добавляем padding справа для возможной иконки */
  border: 2px solid #e0e0e0; /* Более выраженная граница */
  border-radius: 25px; /* Сильное скругление углов */
  font-size: 17px; /* Немного больше шрифт */
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none; /* Убираем стандартный outline при фокусе */
}

.search-input:focus {
  border-color: var(--main-blue); /* Цвет границы при фокусе */
  box-shadow: 0 0 0 3px rgba(var(--main-blue-rgb), 0.2); /* Тень при фокусе */
}

.search-input::placeholder {
  color: #a0a0a0; /* Светлее плейсхолдер */
  opacity: 1; /* Убедимся, что opacity не уменьшается в Firefox */
}

/* Можно добавить иконку поиска */
/*
.search-bar::after {
  content: '\1F50D'; // Unicode символ лупы
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: #a0a0a0;
  font-size: 20px;
  pointer-events: none; // Не мешает кликать по полю
}
*/

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.buttons-row {
  display: flex;
  gap: 16px;
  justify-content: center;
}

@media (max-width: 700px) {
  .news-section,
  .recommend-section {
    padding: 0 16px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .buttons-row {
    flex-direction: column;
  }
  
  .news-block {
    padding: 24px;
  }
  
  .news-content h3 {
    font-size: 24px;
  }
  
  .news-content p {
    font-size: 16px;
  }
  
  .benefits-section {
    padding: 0 16px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .features-section {
    padding: 0 16px;
  }
  
  .feature-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .feature-icon {
    padding-top: 0;
    margin-bottom: 10px;
  }
}
</style> 