<template>
  <div class="profile-page">
    <div class="container">
      <h1>Мой профиль</h1>
      <div v-if="user" class="profile-content card">
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-image-container">
              <img 
                :src="user.profileImage || '/images/default-avatar.png'" 
                :alt="user.name"
                class="profile-image"
              >
              <div class="image-upload-overlay" @click="triggerFileInput">
                <span>Изменить фото</span>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                accept="image/*" 
                style="display: none"
                @change="handleImageUpload"
              >
            </div>
            <h2 class="profile-name">{{ user.name }}</h2>
            <p class="profile-email">{{ user.email }}</p>
          </div>

          <div class="profile-content">
            <div class="profile-section">
              <h3>О себе</h3>
              <textarea 
                v-model="user.description" 
                class="profile-description"
                placeholder="Расскажите о себе..."
                @blur="updateProfile"
              ></textarea>
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
          </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

interface FileInput extends HTMLInputElement {
  files: FileList | null
}

const router = useRouter()
const { user, isAuthenticated, checkAuth, logout, updateUser } = useAuth()
const fileInput = ref<FileInput | null>(null)

// Добавляем функцию для обновления данных пользователя
const refreshUserData = async () => {
  try {
    const response = await fetch('/api/user/profile')
    if (response.ok) {
      const data = await response.json()
      if (data.user) {
        // Обновляем данные пользователя
        Object.assign(user.value, data.user)
      }
    }
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error)
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as FileInput
  const file = target.files?.[0]
  if (!file) return

  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }

  // Проверяем размер файла (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Размер файла не должен превышать 5MB')
    return
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await fetch('/api/user/profile/image', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        // Обновляем изображение в профиле
        if (user.value) {
          user.value.profileImage = data.imageUrl
          await updateUser(user.value)
        }
      } else {
        alert(data.message || 'Ошибка при загрузке изображения')
      }
    } else {
      alert('Ошибка при загрузке изображения')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Ошибка при загрузке изображения')
  }
}

const updateProfile = async () => {
  if (user.value) {
    try {
      const response = await fetch('/api/user/profile/description', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: user.value.description
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Обновляем данные пользователя
          if (user.value) {
            user.value.description = data.user.description
          }
        } else {
          alert(data.message || 'Ошибка при обновлении профиля')
        }
      } else {
        alert('Ошибка при обновлении профиля')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Ошибка при обновлении профиля')
    }
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const goToEvent = (id: number) => {
  router.push(`/events/${id}`)
}

onMounted(async () => {
  await checkAuth()
  if (isAuthenticated.value) {
    await refreshUserData()
  }
})
</script>

<style scoped>
.profile-page {
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
.image-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}
.image-upload-overlay span {
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
}
.profile-image-container:hover .image-upload-overlay {
  opacity: 1;
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
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  line-height: 1.6;
  resize: vertical;
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
</style> 