<template>
  <div class="event-page">
    <div class="container">
      <div v-if="event" class="event-card card event-detail">
        <h1>{{ event.title }}</h1>
        <div class="event-meta">
          <span><b>Дата:</b> {{ formatDate(event.date) }}</span>
          <span><b>Место:</b> {{ event.place }}</span>
        </div>
        <div class="event-desc">{{ event.description }}</div>
        <div class="event-contact"><b>Контакт:</b> {{ event.contact }}</div>
        <div class="event-creator"><b>Создатель:</b> {{ event.creator?.name }} ({{ event.creator?.email }})</div>
        <div class="event-actions">
          <button v-if="!isParticipant && isAuthenticated" class="btn" @click="joinEvent" :disabled="joining">{{ joining ? 'Вступаем...' : 'Вступить' }}</button>
          <span v-if="isParticipant" class="joined-label">Вы участник</span>
          <span v-if="!isAuthenticated" class="not-auth">Войдите, чтобы вступить</span>
        </div>
        <div class="event-participants">
          <h3>Участники ({{ event.participants.length }})</h3>
          <ul>
            <li v-for="p in event.participants" :key="p.user.id">
              {{ p.user.name }} <span style="color:#aaa">({{ p.user.email }})</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="event-card card">
        <p>Мероприятие не найдено</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { user, isAuthenticated } = useAuth()
const event = ref(null)
const joining = ref(false)
const isParticipant = computed(() => {
  if (!event.value || !user.value) return false
  return event.value.participants.some(p => p.user.id === user.value.id)
})

const fetchEvent = async () => {
  const res = await $fetch(`/api/events/${route.params.id}`)
  if (res.success) {
    event.value = res.event
  }
}
onMounted(fetchEvent)

const joinEvent = async () => {
  joining.value = true
  try {
    const res = await $fetch(`/api/events/${route.params.id}/join`, { method: 'POST' })
    if (res.success) {
      await fetchEvent()
    } else {
      alert(res.message)
    }
  } catch (e) {
    alert('Ошибка вступления')
  } finally {
    joining.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.event-page {
  padding: 2rem 0;
}
.event-detail h1 {
  margin-bottom: 1rem;
  color: var(--main-blue-dark);
}
.event-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  color: var(--main-blue);
  font-weight: 500;
}
.event-desc {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.event-contact, .event-creator {
  margin-bottom: 0.5rem;
  color: #5a6a7a;
}
.event-actions {
  margin-bottom: 1.5rem;
}
.joined-label {
  color: var(--main-blue-dark);
  font-weight: 600;
  margin-left: 1rem;
}
.not-auth {
  color: #dc3545;
  margin-left: 1rem;
}
.event-participants {
  margin-top: 1.5rem;
}
.event-participants ul {
  list-style: none;
  padding: 0;
}
.event-participants li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #f0f0f0;
}
</style> 