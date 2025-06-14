<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-image-container">
        <img 
          :src="profileImage || '/images/default-avatar.png'" 
          :alt="user?.name || 'Фото профиля'"
          class="profile-image"
        >
        <div 
          v-if="isOwnProfile" 
          class="image-upload-overlay" 
          @click="triggerFileInput"
        >
          <span class="upload-icon">📷</span>
          <span class="upload-text">Изменить фото</span>
        </div>
        <input 
          v-if="isOwnProfile"
          type="file" 
          ref="fileInput" 
          accept="image/*" 
          class="hidden-input" 
          @change="handleImageUpload"
        >
      </div>
      <h2 class="profile-name">{{ user?.name || 'Имя пользователя' }}</h2>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h3>О себе</h3>
        <div class="description-container">
          <textarea 
            v-if="isOwnProfile"
            v-model="description" 
            placeholder="Расскажите о себе..."
            class="profile-description"
            :disabled="!isEditing"
          ></textarea>
          <p v-else class="profile-description">{{ description || 'Пользователь пока ничего не написал о себе.' }}</p>
          <div v-if="isOwnProfile" class="edit-buttons">
            <button 
              v-if="!isEditing" 
              @click="startEditing" 
              class="edit-button"
            >
              Редактировать
            </button>
            <template v-else>
              <button @click="saveChanges" class="save-button">Сохранить</button>
              <button @click="cancelEditing" class="cancel-button">Отмена</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

const fileInput = ref(null)
const profileImage = ref('')
const description = ref('')
const isEditing = ref(false)
const originalDescription = ref('')

// Обновляем данные при изменении пользователя
watch(() => props.user, (newUser) => {
  if (newUser) {
    console.log('UserProfile: User data updated:', newUser)
    profileImage.value = newUser.profileImage || '/images/default-avatar.png'
    description.value = newUser.description || ''
    isEditing.value = false
  }
}, { immediate: true, deep: true })

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверяем размер файла (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Размер файла не должен превышать 5MB')
    return
  }

  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, загрузите изображение')
    return
  }

  try {
    const formData = new FormData()
    formData.append('image', file)
    
    // Отправляем изображение на сервер
    const response = await fetch('/api/upload-profile-image', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      profileImage.value = data.imageUrl
      // Обновляем профиль пользователя
      await updateUserProfile({ profileImage: data.imageUrl })
      // Обновляем данные пользователя в родительском компоненте
      if (props.user) {
        props.user.profileImage = data.imageUrl
      }
    } else {
      throw new Error('Ошибка при загрузке изображения')
    }
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error)
    alert('Не удалось загрузить изображение')
  }
}

const startEditing = () => {
  originalDescription.value = description.value
  isEditing.value = true
}

const cancelEditing = () => {
  description.value = originalDescription.value
  isEditing.value = false
}

const saveChanges = async () => {
  try {
    await updateUserProfile({ description: description.value })
    isEditing.value = false
  } catch (error) {
    console.error('Ошибка при сохранении описания:', error)
    alert('Не удалось сохранить изменения')
  }
}

const updateUserProfile = async (updates) => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Ошибка при обновлении профиля')
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error)
    throw error
  }
}

onMounted(async () => {
  if (props.user) {
    // Загружаем фото профиля из базы данных
    profileImage.value = props.user.profileImage || '/images/default-avatar.png'
    description.value = props.user.description || ''
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  border-radius: 12px;

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
  border: 1px solid #8a2be2; /* Фиолетовая рамка */
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
  width: 100%;
  height: 100%;
 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  color: white;
}

.profile-image-container:hover .image-upload-overlay {
  opacity: 1;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.hidden-input {
  display: none;
}

.profile-name {
  font-size: 24px;
  color: #8a2be2; /* Фиолетовый цвет текста */
  margin: 0;
}

.profile-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-section {
  margin-bottom: 20px;
}

.profile-section h3 {
  color: #8a2be2; /* Фиолетовый цвет заголовка */
  margin-bottom: 15px;
}

.description-container {
  position: relative;
}

.profile-description {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 1rem;
}

.profile-description:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-button,
.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #8a2be2;
  color: white;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.edit-button:hover {
  background-color: #7b1fa2;
}

.save-button:hover {
  background-color: #45a049;
}

.cancel-button:hover {
  background-color: #da190b;
}
</style> 