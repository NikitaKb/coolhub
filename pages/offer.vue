<template>
  <section class="offer-form-section">
    <h2>Предложить мероприятие</h2>
    <form class="offer-form" @submit.prevent="submitEvent">
      <label for="event-title">Название мероприятия</label>
      <input 
        type="text" 
        id="event-title" 
        v-model="eventForm.title"
        required>

      <label for="event-desc">Краткое описание</label>
      <textarea 
        id="event-desc" 
        v-model="eventForm.description"
        rows="3" 
        required></textarea>

      <label for="event-date">Дата проведения</label>
      <input 
        type="date" 
        id="event-date" 
        v-model="eventForm.date"
        required>

      <label for="event-place">Место проведения</label>
      <input 
        type="text" 
        id="event-place" 
        v-model="eventForm.place"
        required>

      <label for="event-contact">Контакт для связи</label>
      <input 
        type="text" 
        id="event-contact" 
        v-model="eventForm.contact"
        required>

      <button class="btn" type="submit" :disabled="isLoading">{{ isLoading ? 'Отправка...' : 'Отправить' }}</button>
      <div v-if="message" :class="{'success-message': success, 'error-message': !success}" style="margin-top:10px;">{{ message }}</div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const eventForm = ref({
  title: '',
  description: '',
  date: '',
  place: '',
  contact: ''
})
const isLoading = ref(false)
const message = ref('')
const success = ref(false)

const submitEvent = async () => {
  isLoading.value = true
  message.value = ''
  success.value = false
  try {
    const res = await $fetch('/api/events', {
      method: 'POST',
      body: {
        ...eventForm.value,
        date: eventForm.value.date // строка, сервер преобразует в Date
      }
    })
    if (res.success) {
      message.value = 'Мероприятие успешно создано!'
      success.value = true
      eventForm.value = { title: '', description: '', date: '', place: '', contact: '' }
    } else {
      message.value = res.message || 'Ошибка отправки'
      success.value = false
    }
  } catch (e) {
    message.value = 'Ошибка отправки'
    success.value = false
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.offer-form-section {
  max-width: 600px;
  margin: 40px auto 60px auto;
  padding: 0 32px;
}

.offer-form-section h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--main-text);
  margin-bottom: 24px;
  text-align: center;
}

.offer-form {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #bfc9d133;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.offer-form label {
  font-size: 14px;
  color: var(--main-text);
  margin-bottom: 4px;
  font-weight: 500;
}

.offer-form input,
.offer-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--main-shadow-color);
  border-radius: 8px;
  font-size: 15px;
  background: var(--main-bg);
  color: var(--main-text);
  resize: none;
  outline: none;
  transition: border 0.2s;
}

.offer-form input:focus,
.offer-form textarea:focus {
  border-color: var(--main-blue);
}

.offer-form button {
  background: var(--main-blue);
  color: var(--main-white);
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.offer-form button:hover {
  background: var(--main-blue-dark);
}

@media (max-width: 700px) {
  .offer-form-section {
    padding: 0 16px;
  }
  
  .offer-form {
    padding: 24px 16px;
  }
}

.success-message {
  color: var(--main-blue-dark);
  background: #e6f7ff;
  border: 1px solid var(--main-blue);
  border-radius: 6px;
  padding: 0.5rem 1rem;
}
.error-message {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.5rem 1rem;
}
</style> 