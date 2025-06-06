<template>
  <div class="auth-form card">
    <h2>{{ isLogin ? 'Вход' : 'Регистрация' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div v-if="!isLogin" class="form-group">
        <label for="name">Имя</label>
        <input id="name" v-model="form.name" type="text" required placeholder="Введите ваше имя" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required placeholder="Введите ваш email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input id="password" v-model="form.password" type="password" required placeholder="Введите ваш пароль" minlength="6" />
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться') }}
      </button>
    </form>
    <div class="auth-switch">
      <button type="button" class="btn btn-link" @click="toggleMode">
        {{ isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{ initialMode?: 'login' | 'register' }>()
const emit = defineEmits<{ (e: 'success'): void; (e: 'error', message: string): void }>()

const { register, login, loading, error } = useAuth()
const isLogin = ref(props.initialMode === 'register' ? false : true)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  let result
  if (isLogin.value) {
    result = await login(form.email, form.password)
  } else {
    result = await register(form.name, form.email, form.password)
  }
  if (result.success) {
    emit('success')
  } else {
    emit('error', result.message)
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  form.name = ''
  form.email = ''
  form.password = ''
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.auth-form h2 {
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.form-group input:focus {
  outline: none;
  border-color: var(--main-blue);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}
.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}
.btn-link {
  background: none;
  color: #007bff;
  text-decoration: underline;
  padding: 0;
  margin-top: 1rem;
}
.btn-link:hover {
  color: #0056b3;
}
.auth-switch {
  margin-top: 1rem;
  text-align: center;
}
.error-message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
}
</style> 