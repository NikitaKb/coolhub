import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email и пароль обязательны'
      })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Неверный email или пароль'
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Неверный email или пароль'
      })
    }

    // Устанавливаем cookie с ID пользователя
    setCookie(event, 'user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 дней
    })

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: (error as any).message || 'Ошибка входа'
    })
  }
}) 