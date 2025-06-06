<template>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <NuxtLink to="/" class="logo">
          <span class="logo-text">Cool<span class="logo-highlight">Hub</span></span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Главная</NuxtLink>
          <NuxtLink to="/offer" class="nav-link">Предложить</NuxtLink>
          <template v-if="isAuthenticated">
            <NuxtLink to="/profile" class="nav-link nav-link-profile">Профиль</NuxtLink>
            <span class="nav-user">{{ user?.name }}</span>
            <button class="btn btn-link" @click="handleLogout">Выйти</button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="btn btn-primary">Войти</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-outline">Регистрация</NuxtLink>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
const router = useRouter()
const { user, logout, isAuthenticated, checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.header {
  background: var(--main-white);
  box-shadow: 0 2px 8px #bfc9d133;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.2s;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: block;
  text-decoration: none;
}

.logo-text {
  font-size: 28px;
  font-weight: 800;
  color: var(--main-blue);
  letter-spacing: -0.5px;
  position: relative;
}

.logo-highlight {
  color: #dc3545;
  position: relative;
}

.logo-highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 4px;
  background: #dc3545;
  opacity: 0.2;
  border-radius: 2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--main-blue);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
  padding: 0.5rem 1rem;
  border-radius: var(--main-radius);
}

.nav-link:hover, .nav-link-profile {
  background: var(--main-blue);
  color: var(--main-white) !important;
}

.nav-user {
  color: var(--main-blue);
  font-weight: 600;
  margin: 0 0.5rem;
}

.btn {
  font-size: 0.95rem;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--main-blue);
  color: var(--main-white);
  border: none;
}

.btn-primary:hover {
  background-color: var(--main-blue-dark);
}

.btn-outline {
  background-color: var(--main-white);
  color: var(--main-blue);
  border: 2px solid var(--main-blue);
}

.btn-outline:hover {
  background-color: var(--main-blue);
  color: var(--main-white);
}

.btn-link {
  background: none;
  border: none;
  color: #dc3545;
  padding: 0;
}

.btn-link:hover {
  color: #c82333;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    display: none;
  }

  .nav-link:first-child {
    display: block;
  }

  .logo-text {
    font-size: 24px;
  }
}
</style> 