<template>
  <div class="user-profile-page">
    <div class="container">
      <h1>Профиль пользователя</h1>
      <div v-if="user" class="profile-content card">
        <div class="debug-info" v-if="useRuntimeConfig().public.dev">
          <p>Запрошенный ID: {{ route.params.id }}</p>
          <p>Текущий пользователь ID: {{ currentUser?.id }}</p>
          <p>Просматриваемый профиль ID: {{ user.id }}</p>
          <p>URL: {{ $route.fullPath }}</p>
        </div>

        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-image-container">
              <img 
                :src="user.profileImage || '/images/default-avatar.png'" 
                :alt="user.name"
                class="profile-image"
              >
            </div>
            <h2 class="profile-name">{{ user.name }}</h2>
            <p class="profile-email">{{ user.email }}</p>
          </div>

          <div class="profile-content">
            <div class="profile-section">
              <h3>О себе</h3>
              <p class="profile-description">{{ user.description || 'Пользователь пока ничего не написал о себе.' }}</p>
            </div>

            <!-- Раздел созданных мероприятий -->
            <div class="created-events">
              <h3>Мероприятия пользователя</h3>
              <ul v-if="user.createdEvents && user.createdEvents.length">
                <li v-for="event in user.createdEvents" :key="event.id" class="event-item">
                  <div class="event-content" @click="goToEvent(event.id)">
                    <h4>{{ event.title }}</h4>
                    <p>{{ new Date(event.date).toLocaleDateString() }} - {{ event.place }}</p>
                    <p class="participants-count">Участников: {{ event.participants?.length || 0 }}</p>
                  </div>
                </li>
              </ul>
              <p v-else>Пользователь еще не создал ни одного мероприятия.</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="profile-content card">
        <p>Пользователь не найден.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const router = useRouter()
const { user: currentUser } = useAuth()
const user = ref(null)

const fetchUserProfile = async () => {
  try {
    const userId = route.params.id
    console.log('Fetching profile for user ID:', userId)
    
    // Сбрасываем текущего пользователя перед загрузкой нового
    user.value = null
    
    const response = await fetch(`/api/user/${userId}/profile`)
    if (response.ok) {
      const data = await response.json()
      console.log('Received user data:', data)
      if (data.success) {
        user.value = data.user
        console.log('Set user profile:', user.value)
      } else {
        console.error('Failed to fetch user profile: success is false')
        user.value = null
      }
    } else {
      console.error('Failed to fetch user profile:', response.status)
      user.value = null
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    user.value = null
  }
}

const goToEvent = (id) => {
  router.push(`/events/${id}`)
}

// Следим за изменениями ID в URL
watch(() => route.params.id, (newId) => {
  console.log('Route ID changed:', newId)
  if (newId) {
    fetchUserProfile()
  }
})

onMounted(() => {
  console.log('User profile page mounted')
  fetchUserProfile()
})
</script>

<style scoped>
.user-profile-page {
  padding: 2rem 0;
}

.profile-content {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.debug-info {
  background: #f8f9fa;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-family: monospace;
}

.debug-info p {
  margin: 0.5rem 0;
  color: #666;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-image-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #8a2be2;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 24px;
  color: #8a2be2;
  margin: 0 0 0.5rem;
}

.profile-email {
  color: #666;
  margin: 0;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-section h3 {
  color: #8a2be2;
  margin-bottom: 1rem;
}

.profile-description {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  line-height: 1.6;
}

.created-events {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.created-events h3 {
  color: #8a2be2;
  margin-bottom: 1rem;
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
  color: #8a2be2;
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