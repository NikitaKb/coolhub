<template>
  <div class="auth-page">
    <AuthForm @success="handleSuccess" @error="handleError" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const handleSuccess = () => {
  router.push('/profile')
}
const handleError = (error: string) => {
  // Можно добавить уведомление об ошибке
  console.error(error)
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}
</style> 