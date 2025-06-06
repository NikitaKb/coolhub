import { H3Event, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { name, email, password } = body

  if (!name || !email || !password) {
    return { success: false, message: 'Все поля обязательны' }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { success: false, message: 'Пользователь с таким email уже зарегистрирован' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  // Можно добавить установку cookie/session здесь

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    message: 'Регистрация успешна',
  }
}) 