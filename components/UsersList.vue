<template>
  <div class="users-list">
    <button class="toggle-button" @click="isOpen = !isOpen">
      {{ isOpen ? '✕' : '👥' }}
    </button>

    <div v-show="isOpen" class="users-content">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск пользователей..."
          class="search-input"
        >
      </div>

      <div class="users-grid">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="user-card"
          @click="navigateToProfile(user.id)"
        >
          <div class="user-avatar">
            <img src="/images/default-avatar.png" :alt="user.name">
          </div>
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const users = ref([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

const navigateToProfile = (userId) => {
  console.log('Navigating to user profile:', userId)
  router.push(`/user/${userId}`)
}

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users')
    if (response.ok) {
      const data = await response.json()
      console.log('Fetched users:', data.users)
      users.value = data.users
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-list {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.toggle-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;

  color: rgb(0, 0, 0);
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
 
  transition: all 0.3s ease;
}

.toggle-button:hover {
  transform: scale(1.1);
}

.users-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 8px;

  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.users-grid {
  display: grid;
  gap: 1rem;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.user-card:hover {
  background: #e9ecef;
  transform: translateX(-5px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0;
  font-size: 14px;
  color: var(--main-blue-dark);
}

.user-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style> 