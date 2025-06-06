<template>
  <div class="profile-page">
    <div class="container">
      <h1>Профиль пользователя</h1>
      <div v-if="user" class="profile-content card">
        <div class="profile-info">
          <h2>{{ user.name }}</h2>
          <p class="email">{{ user.email }}</p>
        </div>
        
        <!-- Раздел созданных мероприятий -->
        <div class="created-events">
          <h3>Мои мероприятия</h3>
          <ul v-if="user.createdEvents && user.createdEvents.length">
            <li v-for="event in user.createdEvents" :key="event.id" class="event-item">
              <div class="event-content" @click="goToEvent(event.id)">
                <h4>{{ event.title }}</h4>
                <p>{{ new Date(event.date).toLocaleDateString() }} - {{ event.place }}</p>
                <p class="participants-count">Участников: {{ event.participants?.length || 0 }}</p>
              </div>
            </li>
          </ul>
          <p v-else>Вы еще не создали ни одного мероприятия.</p>
        </div>

        <div class="profile-actions">
          <button class="btn btn-primary" @click="handleLogout">Выйти</button>
        </div>
      </div>
      <div v-else class="profile-content card">
        <p>Вы не авторизованы.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, checkAuth, logout } = useAuth()

onMounted(() => {
  checkAuth()
})

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const goToEvent = (id: number) => {
  router.push(`/events/${id}`)
}
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
}
.profile-content {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.profile-info {
  margin-bottom: 2rem;
}
.profile-info h2 {
  margin: 0 0 0.5rem;
  color: var(--main-blue-dark);
}
.profile-info .email {
  color: #666;
  margin: 0;
}
.profile-actions {
  display: flex;
  justify-content: flex-end;
}
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
.btn-primary {
  background-color: #dc3545;
  color: white;
}
.btn-primary:hover {
  background-color: #c82333;
}

.created-events {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.created-events h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--main-blue-dark);
}

.event-item {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-content {
  cursor: pointer;
}

.event-content h4 {
  margin: 0 0 0.5rem;
  color: var(--main-blue);
}

.event-content p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

.participants-count {
  margin-top: 0.5rem !important;
  color: #666;
  font-size: 0.85rem !important;
}
</style> 