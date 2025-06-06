import { H3Event, readBody, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    return { success: false, message: 'Все поля обязательны' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { success: false, message: 'Пользователь не найден' }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return { success: false, message: 'Неверный пароль' }
  }

  // Устанавливаем cookie с userId (для простоты, не для продакшена)
  setCookie(event, 'userId', String(user.id), { httpOnly: true, path: '/' })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    message: 'Вход выполнен успешно',
  }
}) 