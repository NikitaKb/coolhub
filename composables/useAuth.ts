import { ref } from 'vue'

export function useAuth() {
  const user = useState<any>('auth-user', () => null)
  const isAuthenticated = useState<boolean>('auth-is-authenticated', () => false)
  const loading = ref(false)
  const error = ref('')

  // Проверка авторизации при загрузке
  const checkAuth = async () => {
    loading.value = true
    try {
      const res = await $fetch('/api/user/profile')
      if (res.success) {
        user.value = res.user
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch {
      user.value = null
      isAuthenticated.value = false
    }
    loading.value = false
  }

  // Регистрация
  const register = async (name: string, email: string, password: string) => {
    error.value = ''
    loading.value = true
    try {
      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })
      if (res.success) {
        await login(email, password)
        return { success: true }
      } else {
        error.value = res.message
        return { success: false, message: res.message }
      }
    } catch (e) {
      error.value = 'Ошибка регистрации'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Вход
  const login = async (email: string, password: string) => {
    error.value = ''
    loading.value = true
    try {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      if (res.success) {
        await checkAuth()
        return { success: true }
      } else {
        error.value = res.message
        return { success: false, message: res.message }
      }
    } catch (e) {
      error.value = 'Ошибка входа'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Выход (очистка cookie на клиенте не требуется, просто сбрасываем состояние)
  const logout = async () => {
    user.value = null
    isAuthenticated.value = false
    // Можно добавить API для выхода, если потребуется
  }

  return { user, isAuthenticated, loading, error, checkAuth, register, login, logout }
} 