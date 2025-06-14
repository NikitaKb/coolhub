import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Получаем ID из URL
    const id = event.context.params?.id
    console.log('Raw ID from URL params:', id)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    const userId = parseInt(id)
    console.log('Parsed user ID:', userId)

    // Получаем текущего пользователя из cookie
    const currentUserId = getCookie(event, 'user_id')
    console.log('Current user ID from cookie:', currentUserId)

    if (isNaN(userId)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid user ID format'
      })
    }

    // Ищем пользователя по ID
    console.log('Searching for user with ID:', userId)
    const user = await prisma.user.findUnique({
      where: {
        id: userId
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
      console.log('User not found with ID:', userId)
      throw createError({
        statusCode: 404,
        message: 'Пользователь не найден'
      })
    }

    console.log('Found user:', {
      id: user.id,
      name: user.name,
      email: user.email,
      isCurrentUser: currentUserId === user.id.toString()
    })

    // Проверяем, что ID пользователя совпадает с запрошенным
    if (user.id !== userId) {
      console.error('User ID mismatch:', { requested: userId, found: user.id })
      throw createError({
        statusCode: 500,
        message: 'Internal server error: User ID mismatch'
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
        createdEvents: user.createdEvents,
        isCurrentUser: currentUserId === user.id.toString()
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