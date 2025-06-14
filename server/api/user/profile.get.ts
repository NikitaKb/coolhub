import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, 'user_id')
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Не авторизован'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        createdEvents: {
          include: {
            participants: true
          }
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Пользователь не найден'
      })
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: (user as any).profileImage,
        description: (user as any).description,
        createdEvents: user.createdEvents
      }
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw createError({
      statusCode: 500,
      message: (error as any).message || 'Error getting profile'
    })
  }
}) 