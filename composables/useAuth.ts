import { ref } from 'vue'

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export function useAuth() {
  const user = useState<any>('auth-user', () => null)
  const isAuthenticated = useState<boolean>('auth-is-authenticated', () => false)
  const loading = ref(false)
  const error = ref('')

  // Проверка авторизации при загрузке
  const checkAuth = async () => {
    loading.value = true
    try {
      const res = await $fetch<AuthResponse>('/api/user/profile')
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
      const res = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })
      if (res.success) {
        await login(email, password)
        return { success: true }
      } else {
        error.value = res.message || 'Ошибка регистрации'
        return { success: false, message: error.value }
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
      const res = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      if (res.success) {
        await checkAuth()
        return { success: true }
      } else {
        error.value = res.message || 'Ошибка входа'
        return { success: false, message: error.value }
      }
    } catch (e) {
      error.value = 'Ошибка входа'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Выход
  const logout = async () => {
    try {
      await $fetch<AuthResponse>('/api/auth/logout', { method: 'POST' })
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const updateUser = async (userData: any) => {
    try {
      loading.value = true
      error.value = ''
      const response = await $fetch<AuthResponse>('/api/user/profile', {
        method: 'PUT',
        body: userData
      })
      if (response.success) {
        user.value = response.user
        return true
      } else {
        error.value = response.message || 'Ошибка при обновлении профиля'
        return false
      }
    } catch (err) {
      console.error('Profile update error:', err)
      error.value = 'Ошибка при обновлении профиля'
      return false
    } finally {
      loading.value = false
    }
  }

  return { user, isAuthenticated, loading, error, checkAuth, register, login, logout, updateUser }
} 